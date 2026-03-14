import mysql.connector
from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

# -----------------------
# Database configuration
# -----------------------
DB_CONFIG = {
    "host":     "localhost",
    "user":     "root",
    "password": "makanijeet@51",
    "database": "coreinventory"
}

def get_cursor():
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn, conn.cursor()

# -----------------------
# Page routes (Serving Liquid Glass HTML)
# -----------------------
@app.route("/")
def home():
    return redirect(url_for("dashboard"))

@app.route("/dashboard.html")
def dashboard():
    conn, cur = get_cursor()
    cur.execute("SELECT COUNT(*) FROM products")
    total_products = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM deliveries")
    total_deliveries = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM inventory_moves")
    total_moves = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM receipts WHERE status != 'Done'")
    pending_receipts = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM transfers WHERE status != 'Done'")
    pending_transfers = cur.fetchone()[0]
    conn.close()

    stats = {
        "products":          total_products,
        "deliveries":        total_deliveries,
        "moves":             total_moves,
        "pending_receipts":  pending_receipts,
        "pending_transfers": pending_transfers
    }
    return render_template("dashboard.html", stats=stats)

@app.route("/receipt.html")
def receipt():
    return render_template("receipt.html")

@app.route("/delivery.html")
def delivery():
    return render_template("delivery.html")

@app.route("/stocks.html")
def stocks():
    return render_template("stocks.html")

@app.route("/history.html")
def history():
    return render_template("history.html")

@app.route("/warehouse.html")
def warehouse():
    return render_template("warehouse.html")

@app.route("/settings.html")
def settings():
    return render_template("settings.html")

@app.route("/profile.html")
def profile():
    return render_template("profile.html")

@app.route("/operations.html")
def operations():
    return render_template("operations.html")

@app.route("/products.html")
def products():
    return render_template("products.html")

# -----------------------
# JSON APIs for JS Frontend
# -----------------------
@app.route("/api/dashboard")
def dashboard_stats():
    conn, cur = get_cursor()
    cur.execute("SELECT COUNT(*) FROM products")
    total_products = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM deliveries")
    total_deliveries = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM inventory_moves")
    total_moves = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM receipts WHERE status != 'Done'")
    pending_receipts = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM transfers WHERE status != 'Done'")
    pending_transfers = cur.fetchone()[0]
    conn.close()

    return jsonify({
        "totalProducts": total_products,
        "lowStock": 0, 
        "pendingReceipts": pending_receipts,
        "pendingDeliveries": total_deliveries,
        "internalTransfers": pending_transfers
    })

@app.route("/api/products")
def get_products():
    conn, cur = get_cursor()
    cur.execute("""
        SELECT p.id, p.name, p.sku, c.name, p.unit, p.stock
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
    """)
    rows = cur.fetchall()
    conn.close()
    return jsonify([{
        "id":       row[0],
        "name":     row[1],
        "sku":      row[2],
        "category": row[3],
        "unit":     row[4],
        "stock":    row[5]
    } for row in rows])

@app.route("/api/products/update_stock", methods=["POST"])
def update_stock():
    data = request.json
    conn, cur = get_cursor()
    for item in data:
        cur.execute("UPDATE products SET stock = %s WHERE id = %s", (item["stock"], item["id"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Stock updated successfully"})

@app.route("/api/deliveries")
def get_deliveries():
    conn, cur = get_cursor()
    cur.execute("SELECT * FROM deliveries ORDER BY scheduled_date DESC")
    rows = cur.fetchall()
    conn.close()
    return jsonify([{
        "id":             row[0],
        "reference":      row[1],
        "from_location":  row[2],
        "to_location":    row[3],
        "contact":        row[4],
        "scheduled_date": str(row[5]),
        "status":         row[6]
    } for row in rows])

@app.route("/api/delivery/create", methods=["POST"])
def create_delivery():
    data = request.json
    conn, cur = get_cursor()
    cur.execute(
        "INSERT INTO deliveries (reference, from_location, to_location, contact, scheduled_date, status) VALUES (%s, %s, %s, %s, %s, %s)",
        (data.get("reference"), data.get("from"), data.get("to"), data.get("contact"), data.get("date"), "Draft")
    )
    conn.commit()
    delivery_id = cur.lastrowid
    conn.close()
    return jsonify({"message": "Delivery created", "id": delivery_id})

@app.route("/api/receipts")
def get_receipts():
    conn, cur = get_cursor()
    cur.execute("""
        SELECT r.id, r.reference, s.name, w.name, r.status, r.scheduled_date
        FROM receipts r
        LEFT JOIN suppliers s ON s.id = r.supplier_id
        LEFT JOIN warehouses w ON w.id = r.warehouse_id
        ORDER BY r.created_at DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return jsonify([{
        "id":             row[0],
        "reference":      row[1],
        "supplier":       row[2],
        "warehouse":      row[3],
        "status":         row[4],
        "scheduled_date": str(row[5])
    } for row in rows])

@app.route("/api/movehistory")
def api_movehistory():
    conn, cur = get_cursor()
    cur.execute("""
        SELECT p.name, m.quantity, m.move_type, m.source, m.destination, m.created_at
        FROM inventory_moves m
        JOIN products p ON p.id = m.product_id
        ORDER BY m.created_at DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return jsonify([{
        "product": row[0], "quantity": row[1], "type": row[2],
        "source": row[3], "destination": row[4], "date": str(row[5])
    } for row in rows])

if __name__ == "__main__":
    app.run(debug=True)