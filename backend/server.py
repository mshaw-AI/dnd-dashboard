from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Connect to SQLite database
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month INTEGER NOT NULL,
            resource TEXT NOT NULL,
            base INTEGER NOT NULL,
            production INTEGER NOT NULL,
            net INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Endpoint to save resources for a specific month
@app.route('/api/resources', methods=['POST'])
def save_resources():
    data = request.json
    month = data['month']
    resources = data['resources']

    conn = get_db_connection()
    cursor = conn.cursor()

    for resource in resources:
        cursor.execute('''
            INSERT INTO resources (month, resource, base, production, net)
            VALUES (?, ?, ?, ?, ?)
        ''', (month, resource['resource'], resource['base'], resource['production'], resource['net']))

    conn.commit()
    conn.close()
    return jsonify({'message': 'Resources saved successfully'}), 201

# Endpoint to retrieve resources for a specific month
@app.route('/api/resources/<int:month>', methods=['GET'])
def get_resources(month):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT resource, base, production, net FROM resources WHERE month = ?', (month,))
    rows = cursor.fetchall()

    conn.close()

    if not rows:
        return jsonify({'error': 'No data found for this month'}), 404

    resources = [dict(row) for row in rows]
    return jsonify(resources)

# Start the server
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)