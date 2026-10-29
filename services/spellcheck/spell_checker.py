"""
Spell checking microservice for Taste City.

Checks restaurant names for misspelled words and suggests corrections,
using pyspellchecker's built-in English dictionary. The main Express app
calls POST /spellcheck when a restaurant is added.

Runs on port 3000. In Docker, it runs as two replicas behind Nginx.
"""
import re
from flask import Flask, request, jsonify
from spellchecker import SpellChecker

app = Flask(__name__)
spell = SpellChecker()  # Loads the default English dictionary


@app.route('/health', methods=['GET'])
def health():
    """Report that the service is running (used by Docker health checks)."""
    return jsonify({"status": "ok"})


@app.route('/spellcheck', methods=['POST'])
def spellcheck():
    """
    Find misspelled words in a piece of text and suggest corrections.

    Expects a JSON body: {"text": "..."}

    Returns:
        200 with {"result": {"misspelled_word": ["suggestion", ...], ...}}
            An empty result ({}) means no misspellings were found. A word
            with no suggestions maps to an empty list.
        400 if the body is missing, isn't JSON, or has no "text" field
    """
    data = request.get_json(silent=True)
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
        # candidates() returns None when it has no suggestions
        suggestions = list(spell.candidates(word) or [])
        result[word] = suggestions

    return jsonify({'result': result})


if __name__ == '__main__':
    app.run(debug=True, port=3000)
