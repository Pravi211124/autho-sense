
# AuthoSense - Continuous Authentication System

AuthoSense is a continuous authentication system that uses face and voice recognition to verify users' identities in real-time.

## Project Components

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Flask)
- **Authentication Methods**: Face recognition, Voice recognition
- **Features**: Auto logout when user is not in front of the camera

## Setup Instructions

### Frontend

Simply open the `index.html` file in a web browser to access the application.

### Backend (Python)

1. Install Python 3.7 or higher.

2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```
   python app.py
   ```

The server will run on `http://localhost:5000`.

### System Requirements

- Python 3.7+
- Modern web browser (Chrome, Firefox, Edge)
- Webcam for face recognition
- Microphone for voice recognition

## Usage

1. Register a new account with face and voice samples
2. Log in using face recognition
3. Dashboard will continuously monitor your presence
4. System will automatically log you out when you're not in front of the camera

## Security Features

- Continuous authentication using biometric data
- Auto-logout functionality for enhanced security
- Multi-factor authentication (face + voice)
