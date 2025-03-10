from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Load location data from the JSON file at startup
with open("US_States_and_Cities.json", "r") as file:
    states_dict = json.load(file)  # states_dict is now a dictionary where keys are state names

# Endpoint to get the list of states
@app.route('/states', methods=['GET'])
def get_states():
    states = list(states_dict.keys())
    return jsonify({"states": states})

# Endpoint to get the list of cities for a specific state
@app.route('/states/<state_name>/cities', methods=['GET'])
def get_cities(state_name):
    cities = states_dict.get(state_name)
    if cities is None:
        return jsonify({"error": f"State '{state_name}' not found"}), 404
    return jsonify({"state": state_name, "cities": cities})

print(f"Service requested, locating states and cities.")

if __name__ == '__main__':
    app.run(debug=True, port=2212)