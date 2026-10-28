from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import hashlib

app = Flask(__name__)
CORS(app)

# Database configuration - update these with your actual credentials
db_config = {
    'user' : '',
    'password' : '',
    'host' : '',
    'database' : ''
}

@app.route('/verify-user', methods=['POST'])
def verify_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    password = data.get("password")
    
    print(f"Service requested, verifying username: {username},{password} ")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM Users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        
        if password == user['password']:
            return jsonify({"status": "success", "message": "Credentials verified"}), 200
        else:
            return jsonify({"status": "failure", "message": "Invalid password"}), 401
    except mysql.connector.Error as err:
        print("Database error:", err)
        return jsonify({"error": "Database error"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
