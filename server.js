require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Database Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Email Transporter (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- 1. SIGNUP API ---
app.post('/api/auth/signup', async (req, res) => {
    const { loginId, email, password } = req.body;

    try {
        // Check for existing user
        const [existing] = await pool.query('SELECT * FROM users WHERE login_id = ? OR email = ?', [loginId, email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Login ID or Email already exists.' });
        }

        // Hash password and insert
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (login_id, email, password_hash) VALUES (?, ?, ?)',
            [loginId, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Database error during signup.' });
    }
});

// --- 2. LOGIN API ---
app.post('/api/auth/login', async (req, res) => {
    const { loginIdOrEmail, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE login_id = ? OR email = ?', [loginIdOrEmail, loginIdOrEmail]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid Login Id or Password' });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: 'Invalid Login Id or Password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
        
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Database error during login.' });
    }
});

// --- 3. FORGOT PASSWORD (Generate & Send OTP) ---
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Email not found.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database (expires in 15 minutes)
        await pool.query(
            'INSERT INTO password_resets (email, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))',
            [email, otp]
        );

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`
        });

        res.json({ message: 'OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ error: 'Error processing forgot password request.' });
    }
});

// --- 4. VERIFY OTP & RESET PASSWORD ---
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Check if OTP is valid and not expired
        const [resets] = await pool.query(
            'SELECT * FROM password_resets WHERE email = ? AND otp_code = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [email, otp]
        );

        if (resets.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);

        // Delete used OTP
        await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);

        res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting password.' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --- GOOGLE OAUTH API ---
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const email = payload.email;

        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        let user;

        if (users.length === 0) {
            // Create new Google user (login_id generated as null or a random string, password null)
            const generatedLoginId = 'G' + Math.random().toString().substring(2, 10);
            const [result] = await pool.query(
                'INSERT INTO users (login_id, email, auth_provider) VALUES (?, ?, ?)',
                [generatedLoginId, email, 'google']
            );
            user = { id: result.insertId, email: email };
        } else {
            user = users[0];
        }

        // Generate JWT Token for your application
        const jwtToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
        
        res.json({ message: 'Google Login successful', token: jwtToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid Google token' });
    }
});