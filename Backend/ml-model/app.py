from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load trained KNN model and dataset
try:
    knn = joblib.load('model/career_model.pkl')
    df = joblib.load('model/dataset.pkl')
    print("✅ Model and dataset loaded successfully.")
except Exception as e:
    print(f"❌ Failed to load model or dataset: {e}")
    knn = None
    df = None

# Convert profile into encoded vector
def encode_profile(profile):
    skills_encoded = [1 if any(skill in profile['skills'] for skill in skill_list) else 0 for skill_list in df['skills']]
    interests_encoded = [1 if any(interest in profile['interests'] for interest in interest_list) else 0 for interest_list in df['interests']]
    education_encoded = [1 if profile['education'] == edu else 0 for edu in df['education']]
    experience_encoded = [1 if profile['experience'] == exp else 0 for exp in df['experience']]
    return np.array(skills_encoded + interests_encoded + education_encoded + experience_encoded).reshape(1, -1)

# Career Recommendation Endpoint
@app.route('/api/profile', methods=['POST'])
def recommend_career():
    try:
        profile = request.json.get('profile', {})
        if not profile:
            return jsonify({'error': 'No profile data received'}), 400

        if knn is None or df is None:
            return jsonify({'error': 'Model or dataset not available'}), 500

        encoded = encode_profile(profile)
        distance, index = knn.kneighbors(encoded)
        match_index = index[0][0]

        recommended = {
            'career': df.iloc[match_index]['career'],
            'mentor': df.iloc[match_index]['mentor']
        }

        return jsonify(recommended)
    except Exception as e:
        print(f"❌ Error in /api/profile: {e}")
        return jsonify({'error': str(e)}), 500

# Mentor Chat Endpoint
@app.route('/api/chat', methods=['POST'])
def chat_with_mentor():
    try:
        user_message = request.json.get('message', '').lower()
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Rule-based offline responses
        if 'growth' in user_message:
            response = "AI is projected to grow at a rate of 12% annually until 2030."
        elif 'demand' in user_message:
            response = "Data Science and DevOps roles are in high demand currently."
        elif 'salary' in user_message:
            response = "AI Engineers in India earn between ₹8L to ₹25L per year."
        elif 'skills' in user_message:
            response = "Top in-demand skills: Python, Cloud, DevOps, Cybersecurity, React."
        else:
            response = "Please ask about growth, demand, salary, or skills for career insights."

        return jsonify({'response': response})
    except Exception as e:
        print(f"❌ Error in /api/chat: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)