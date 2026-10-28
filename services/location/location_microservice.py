from pathlib import Path
import json
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Find the data file next to this script, not in whatever folder
# the service was started from
DATA_FILE = Path(__file__).parent / "US_States_and_Cities.json"

# Load all states and their cities once, when the service starts
with open(DATA_FILE, "r") as file:
    states_dict = json.load(file)  # states_dict is now a dictionary where keys are state names


# Endpoint to get the list of states
@app.route('/states', methods=['GET'])
def get_states():
    print("Service requested: list of states.")
    states = list(states_dict.keys())
    return jsonify({"states": states})


# Endpoint to get the list of cities for a specific state
@app.route('/states/<state_name>/cities', methods=['GET'])
def get_cities(state_name):
    cities = states_dict.get(state_name)
    if cities is None:
        return jsonify({"error": f"State '{state_name}' not found"}), 404
    return jsonify({"state": state_name, "cities": cities})


if __name__ == '__main__':
    app.run(debug=True, port=2212)
