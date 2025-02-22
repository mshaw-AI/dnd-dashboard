from flask import Flask, jsonify, request
import sqlite3
import datetime
import json

app = Flask(__name__)

# Initialize the database
def init_db():
    conn = sqlite3.connect("fort_management.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS resources (
                    id INTEGER PRIMARY KEY,
                    gold INTEGER,
                    lumber INTEGER,
                    stone INTEGER,
                    timestamp TEXT
                 )''')
    c.execute('''CREATE TABLE IF NOT EXISTS workers (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    role TEXT,
                    production TEXT,
                    consumption TEXT
                 )''')
    conn.commit()
    conn.close()

# Initialize default resources and workers
def seed_data():
    conn = sqlite3.connect("fort_management.db")
    c = conn.cursor()
    c.execute("INSERT INTO resources (gold, lumber, stone, timestamp) VALUES (1000, 500, 500, ?)", (datetime.datetime.now(),))
    workers = [
        ("Garek Stonefist", "Stonemason", json.dumps({"stone": 10}), json.dumps({"gold": 2})),
        ("Sister Elira", "Priest/Medic", json.dumps({}), json.dumps({"gold": 5})),
        ("Varis Quill", "Scribe", json.dumps({}), json.dumps({"gold": 3})),
        ("Marla Brewpot", "Chef", json.dumps({}), json.dumps({"gold": 2})),
        ("Captain Drexel", "Quartermaster", json.dumps({"lumber": 5}), json.dumps({"gold": 4}))
    ]
    c.executemany("INSERT INTO workers (name, role, production, consumption) VALUES (?, ?, ?, ?)", workers)
    conn.commit()
    conn.close()

@app.route("/get_resources", methods=["GET"])
def get_resources():
    conn = sqlite3.connect("fort_management.db")
    c = conn.cursor()
    c.execute("SELECT gold, lumber, stone FROM resources ORDER BY id DESC LIMIT 1")
    row = c.fetchone()
    conn.close()
    return jsonify({"gold": row[0], "lumber": row[1], "stone": row[2]})

@app.route("/get_workers", methods=["GET"])
def get_workers():
    conn = sqlite3.connect("fort_management.db")
    c = conn.cursor()
    c.execute("SELECT name, role, production, consumption FROM workers")
    workers = [{"name": row[0], "role": row[1], "production": json.loads(row[2]), "consumption": json.loads(row[3])} for row in c.fetchall()]
    conn.close()
    return jsonify(workers)

@app.route("/next_month", methods=["POST"])
def next_month():
    conn = sqlite3.connect("fort_management.db")
    c = conn.cursor()
    c.execute("SELECT gold, lumber, stone FROM resources ORDER BY id DESC LIMIT 1")
    gold, lumber, stone = c.fetchone()
    
    c.execute("SELECT production, consumption FROM workers")
    for row in c.fetchall():
        production = json.loads(row[0])
        consumption = json.loads(row[1])
        
        for key, value in production.items():
            if key == "gold":
                gold += value
            elif key == "lumber":
                lumber += value
            elif key == "stone":
                stone += value
        
        for key, value in consumption.items():
            if key == "gold":
                gold -= value
            elif key == "lumber":
                lumber -= value
            elif key == "stone":
                stone -= value
    
    c.execute("INSERT INTO resources (gold, lumber, stone, timestamp) VALUES (?, ?, ?, ?)",
              (gold, lumber, stone, datetime.datetime.now()))
    conn.commit()
    conn.close()
    return jsonify({"message": "Resources updated for next month", "gold": gold, "lumber": lumber, "stone": stone})

if __name__ == "__main__":
    init_db()
    seed_data()
    app.run(debug=True)