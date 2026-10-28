"""
User account microservice for Taste City.

Verifies a user's login credentials against the Users table in MySQL.
The main Express app calls POST /verify-user when someone logs in.

Note: passwords are stored and compared as plain text. This project
focuses on the service architecture, not authentication.

Runs on port 5000.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os


app = Flask(__name__)
CORS(app)

# Database settings come from environment variables
db_config = {
    "user": os.environ.get("DB_USER", ""),
    "password": os.environ.get("DB_PASSWORD", ""),
    "host": os.environ.get("DB_HOST", "localhost"),
    "database": os.environ.get("DB_NAME", ""),
}


@app.route('/verify-user', methods=['POST'])
def verify_user():
    """
    Check a username and password against the database.

    Expects a JSON body: {"username": "...", "password": "..."}

    Returns:
        200 if the credentials match
        400 if the body or either field is missing
        401 if the username or password is wrong
        500 if the database can't be reached
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    password = data.get("password")

    print(f"Service requested, verifying username: {username}")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = "SELECT password FROM Users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if user is None or password != user['password']:
            return jsonify({"status": "failure",
                            "message": "Invalid username or password"}), 401

        return jsonify({"status": "success",
                        "message": "Credentials verified"}), 200

    except mysql.connector.Error as err:
        print("Database error:", err)
        return jsonify({"error": "Database error"}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=5000)
