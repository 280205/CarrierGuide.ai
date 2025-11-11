import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import joblib
import os

data = {
    'skills': [['Python', 'Java'], ['Excel', 'SQL'], ['JavaScript', 'React']],
    'interests': [['AI', 'Data Science'], ['Finance', 'Analytics'], ['Web Development']],
    'education': ['BSc CS', 'MBA', 'BSc CS'],
    'experience': ['2 years', '5 years', '3 years'],
    'career': ['Data Scientist', 'Financial Analyst', 'Web Developer'],
    'mentor': ['Dr. AI Expert', 'Finance Guru', 'Web Dev Pro']
}

df = pd.DataFrame(data)

def encode_profile(profile):
    skills_encoded = [1 if any(skill in profile['skills'] for skill in skill_list) else 0 for skill_list in df['skills']]
    interests_encoded = [1 if any(interest in profile['interests'] for interest in interest_list) else 0 for interest_list in df['interests']]
    education_encoded = [1 if profile['education'] == edu else 0 for edu in df['education']]
    experience_encoded = [1 if profile['experience'] == exp else 0 for exp in df['experience']]
    return np.array(skills_encoded + interests_encoded + education_encoded + experience_encoded)

X = np.array([encode_profile({'skills': s, 'interests': i, 'education': e, 'experience': exp}) 
              for s, i, e, exp in zip(df['skills'], df['interests'], df['education'], df['experience'])])

knn = NearestNeighbors(n_neighbors=1, metric='euclidean').fit(X)

os.makedirs('model', exist_ok=True)
joblib.dump(knn, 'model/career_model.pkl')
joblib.dump(df, 'model/dataset.pkl')  # Save dataset too
print("Model and dataset saved successfully!")
