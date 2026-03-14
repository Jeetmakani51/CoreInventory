# 📦 CoreInventory
 
> A modular Inventory Management System built with Flask, MySQL, and vanilla JS — submitted for our first hackathon.
 
---
 
## 🎯 What Is This?
 
CoreInventory is a web-based Inventory Management System (IMS) designed to digitize and streamline stock-related operations within a business. The goal was to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.
 
We built this from scratch over the course of the hackathon — designing the database, building the Flask backend, wiring up authentication, and connecting it all to a frontend with multiple pages.
 
---
 
## ⚠️ Honest Status: Semi-Working
 
We want to be transparent — **this project is semi-functional**.
 
It was working. Like, actually working. Login worked, the dashboard loaded real data from MySQL, the delivery page rendered rows from the database, navigation between pages worked cleanly. We were genuinely proud of it.
 
Then we pushed and pulled between machines.
 
Somewhere in that process — a merge conflict here, a path that worked on one machine but not another, a static file reference that broke silently — things started falling apart. Some pages show 404. Some CSS doesn't load. Some navbar links point to routes that don't exist.
 
We spent the last stretch of the hackathon debugging instead of building new features, and we didn't get everything back to where it was. That's the honest truth.
 
---
 
## ✅ What Actually Works
 
- 🔐 **Authentication** — Signup, Login, Logout all work end-to-end with SHA-256 password hashing stored in MySQL
- 🔑 **OTP Password Reset** — Forgot password flow generates a 6-digit OTP, stores it in the database with a 10-minute expiry, verifies it, and resets the password
- 📊 **Dashboard** — Loads and displays real KPI counts from the database (products, deliveries, receipts, transfers, moves)
- 🗄️ **Database** — Full schema is set up with 13 tables covering users, products, warehouses, suppliers, receipts, deliveries, transfers, inventory moves, settings, and OTP codes
- 🔒 **Route Protection** — Every page checks for a valid session via `@login_required` and redirects to login if not authenticated
- 📦 **Stock Page** — Fetches and renders products from the database
- 📜 **Move History** — Renders inventory move logs from the `inventory_moves` table
 
---
 
## 🚧 What's Broken / Incomplete
 
- Some navbar links still point to old `.html` static paths instead of Flask routes — causes 404 on navigation
- A few pages have `../static/` CSS paths that don't resolve correctly when served through Flask templates
- The receipts, delivery, and transfers pages have backend routes and templates but navigation to them is inconsistent depending on which machine the code runs on
- The `dashboard.js` file fetches from `/api/dashboard` but the KPI values on some builds show `0` instead of live data
- No real email integration for OTP — the OTP prints to the server terminal (fine for demo, not for production)
 
---
 
## 💡 What We Learned
 
This hackathon taught us more than any tutorial ever has. Here's what actually stuck:
 
**Flask & Python**
- How `render_template()`, `url_for()`, and `session` work together
- Why `@login_required` as a decorator is so clean and reusable
- How `request.json` vs `request.form` differ and when to use each
- Why `conn.close()` matters and what happens when you forget it
 
**MySQL**
- Designing a relational schema with foreign keys from scratch
- Why `DROP DATABASE` and recreating is sometimes the fastest fix
- That SHA-256 hashes need to match *exactly* — one missing character (`720a` vs `720a9`) breaks everything silently
 
**Jinja2 Templating**
- The difference between `{% block %}`, `{{ variable }}`, and `{% if %}`
- Why `{% if request.endpoint == 'name' %}active{% endif %}` is the right way to highlight active nav links
- That `{% extends %}` and `{% block %}` must be the very first things in a template or Jinja throws cryptic errors
 
**Frontend & Debugging**
- That `../static/file.css` works when you open HTML directly but breaks completely when Flask serves the template — always use `url_for('static', filename=...)`
- That `F12 → Network tab` is your best friend for finding 404s
- That naming a JS variable `alert` shadows the browser's built-in `alert()` — one of those bugs that takes way too long to find
 
**Git & Collaboration**
- That push/pull conflicts on HTML files are brutal because there's no good auto-merge for them
- That working code on one machine is not the same as working code on another if paths are hardcoded
 
---
 
## 🏗️ Tech Stack
 
| Layer | Technology |
|---|---|
| Backend | Python 3, Flask |
| Database | MySQL with `mysql-connector-python` |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Templating | Jinja2 |
| Auth | SHA-256 hashing, Flask sessions |
| Password Reset | OTP via database (console output for demo) |
 
---
 
## 🗄️ Database Schema
 
13 tables covering the full inventory lifecycle:
 
```
users           → authentication & roles
otp_codes       → password reset OTPs
warehouses      → storage locations
categories      → product categories
products        → product catalog with stock levels
suppliers       → vendor information
receipts        → incoming stock orders
receipt_items   → line items for receipts
deliveries      → outgoing shipments
delivery_items  → line items for deliveries
transfers       → warehouse-to-warehouse moves
transfer_items  → line items for transfers
inventory_moves → full audit ledger of all stock changes
settings        → company configuration
```
 
---
 

 
 
**Default test account:**
first click on "create new one" in signup page and you will see the sign up info just copy what is written in a particular block
- Email: `admin@coreinventory.com`
- Password: `admin123`
 
---
 
## 👥 Team
 
Built with a lot of caffeine, a few moments of "it's actually working!", and several moments of "why did it stop working?" during our first hackathon.
 
We're learning. This project is proof of that — not just in the features that work, but in every bug we hit, debugged, half-fixed, and learned from.
 
**The experience was worth it.**
 
---
 
## 📌 If We Had More Time
 
- Fix all navbar links consistently across every template
- Add proper email delivery for OTP using SMTP
- Complete the receipts and delivery validation flows end-to-end
- Add low stock alerts with a real threshold system
- Make it mobile responsive
- Deploy to a live server
 
---
 
*First hackathon. Not our last.* 🚀
