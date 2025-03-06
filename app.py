
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import time
import json
import cv2
import numpy as np
import face_recognition

app = Flask(__name__)
CORS(app)

# In-memory storage for demo purposes
# In a real application, you'd use a database
users = {}
sessions = {}

@app.route('/')
def index():
    return "AuthoSense API is running"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    face_data = data.get('faceData')
    voice_data = data.get('voiceData')
    
    if not username or not face_data:
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    # Convert base64 image to face encoding
    try:
        face_image = base64_to_image(face_data)
        face_encodings = face_recognition.face_encodings(face_image)
        
        if not face_encodings:
            return jsonify({"success": False, "message": "No face detected in the image"}), 400
        
        face_encoding = face_encodings[0]
        
        # Store user data (in a real app, this would go to a database)
        users[username] = {
            "face_encoding": face_encoding.tolist(),
            "voice_data": voice_data,
            "created_at": time.time()
        }
        
        return jsonify({"success": True, "message": "User registered successfully"})
    except Exception as e:
        print(f"Error registering user: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/verify_face', methods=['POST'])
def verify_face():
    data = request.json
    username = data.get('username')
    face_data = data.get('faceData')
    
    if not username or not face_data:
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    if username not in users:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    try:
        # Convert base64 image to face encoding
        face_image = base64_to_image(face_data)
        face_encodings = face_recognition.face_encodings(face_image)
        
        if not face_encodings:
            return jsonify({"success": False, "message": "No face detected in the image"}), 400
        
        face_encoding = face_encodings[0]
        
        # Compare with stored encoding
        stored_encoding = np.array(users[username]["face_encoding"])
        matches = face_recognition.compare_faces([stored_encoding], face_encoding)
        
        if matches[0]:
            # Update session (in a real app, you'd use proper session management)
            session_id = f"{username}_{time.time()}"
            sessions[session_id] = {
                "username": username,
                "last_verified": time.time()
            }
            
            return jsonify({
                "success": True, 
                "message": "Face verified successfully",
                "session_id": session_id,
                "confidence": float(face_recognition.face_distance([stored_encoding], face_encoding)[0])
            })
        else:
            return jsonify({"success": False, "message": "Face verification failed"}), 401
    except Exception as e:
        print(f"Error verifying face: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/verify_voice', methods=['POST'])
def verify_voice():
    data = request.json
    username = data.get('username')
    voice_data = data.get('voiceData')
    
    if not username or not voice_data:
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    if username not in users:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    # In a real app, you'd use proper voice recognition
    # For demo purposes, we'll just simulate verification
    confidence = 0.85  # Simulated confidence score
    
    if confidence > 0.7:
        # Update session
        if username in sessions:
            sessions[username]["last_verified"] = time.time()
        
        return jsonify({
            "success": True, 
            "message": "Voice verified successfully",
            "confidence": confidence
        })
    else:
        return jsonify({"success": False, "message": "Voice verification failed"}), 401

@app.route('/check_session', methods=['POST'])
def check_session():
    data = request.json
    session_id = data.get('sessionId')
    
    if not session_id or session_id not in sessions:
        return jsonify({"success": False, "message": "Invalid session"}), 401
    
    session = sessions[session_id]
    last_verified = session["last_verified"]
    current_time = time.time()
    
    # Check if session has expired (timeout of 5 minutes)
    timeout = 300  # 5 minutes in seconds
    if current_time - last_verified > timeout:
        # Session expired
        del sessions[session_id]
        return jsonify({"success": False, "message": "Session expired"}), 401
    
    return jsonify({
        "success": True,
        "message": "Session active",
        "username": session["username"],
        "last_verified": last_verified
    })

def base64_to_image(base64_str):
    # Remove data URL prefix if present
    if "base64," in base64_str:
        base64_str = base64_str.split("base64,")[1]
    
    # Decode base64 string to image
    img_data = base64.b64decode(base64_str)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert from BGR (OpenCV format) to RGB (face_recognition format)
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
