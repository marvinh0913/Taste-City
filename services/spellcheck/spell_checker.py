from flask import Flask, request, jsonify
import re
from spellchecker import SpellChecker

app = Flask(__name__)
spell = SpellChecker()  # Loads the default English dictionary

@app.route('/spellcheck', methods=['POST'])
def spellcheck():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Please provide a valid 'text' field in JSON request body"}), 400
    
    print(f"Service requested, spell checking '{data.get('text')}' for errors.")

    text = data['text']
    # Use regex to extract words (ignoring punctuation)
    words = re.findall(r'\b\w+\b', text)
    # Identify misspelled words
    misspelled = spell.unknown(words)

    result = {}
    for word in misspelled:
        # Get suggestions for each misspelled word
        suggestions = list(spell.candidates(word))
        result[word] = suggestions

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True, port=3000)