from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open('places.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

@app.route('/places', methods=['GET'])
def get_places():
    print("/places 요청 도착")  
    category = request.args.get('category')
    if category:
        filtered = [p for p in places if p['category'] == category]
    else:
        filtered = places
    return jsonify(filtered)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)
