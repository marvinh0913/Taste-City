from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/sort-data', methods=['POST'])
def sort_data():
    try:
        data = request.get_json()
        user_data = data.get("user_data", []) 
        sort_by = data.get("sortBy", "name")

        print(f"Service requested, sorting data by '{sort_by}' in ascending order.")  

        # Sort Data
        sorted_data = sorted(user_data, key=lambda x: x[sort_by])

        print("Sorting completed. Sending sorted data back to the client.")  

        return jsonify({"status": "success", "data": sorted_data})

    except Exception as e:
        print(f"Error during sorting: {str(e)}")  
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    print("Sorting Microservice is running")
    app.run(host="0.0.0.0", port=5252, debug=True)