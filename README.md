# Chat With Me (CWM)

Chat With Me (CWM) is a real-time chat application built with **React Native** and **Firebase**. It allows users to sign up, log in, send messages, and interact with friends in real-time. The app also supports features like profile pictures, online status, and message timestamps.

 **Download the app**: [expo link](https://expo.dev/artifacts/eas/hxATpr2JpQfjbRgcGYZdqr.apk) / 
                       [MediaFire](https://expo.dev/artifacts/eas/hxATpr2JpQfjbRgcGYZdqr.apk)
---

## Features

### 1. **Authentication**
   - **Sign Up**: Users can create an account using their email and password.
   - **Log In**: Existing users can log in using their credentials.
   - **Reset password**: you can use your email to get a reset password link in your email
   - **Profile Picture**: Users can upload or set a default profile picture during sign-up.

### 2. **Real-Time Chat**
   - **Send Messages**: Users can send text messages in real-time.
   - **Message Timestamps**: Each message displays the time it was sent.
   - **Online Status**: Users can see if their friends are online or offline.

### 3. **Friends and Friend Requests**
   - **Add Friends**: Users can send friend requests to other users.
   - **Accept Requests**: Users can accept incoming friend requests.
   - **Friend List**: Users can view their list of friends and start chatting with them.

### 4. **Profile Management**
   - **Update Profile**: Users can update their username, status, and profile picture.
   - **Default Profile Picture**: If no profile picture is uploaded, a default image is used.

### 5. **Image Support**
   - **Profile Pictures**: Users can upload images as their profile pictures.
   - **Image Messages**: Users can send images in chats (optional, if implemented).

### 6. **Firebase Integration**
   - **Firestore**: Used to store user data, messages, and friend lists.
   - **Firebase Authentication**: Handles user authentication.
   - **Real-Time Updates**: Firestore listeners enable real-time updates for messages and friend requests.

---

## Technologies Used

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore, Firebase Authentication)
- **State Management**: React Context API
- **Navigation**: React Navigation
- **Image Picker**: `expo-image-picker`
- **File System**: `expo-file-system`
- **UI Components**: React Native Elements, Custom Components

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Firebase project with Firestore and Authentication enabled

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/RACHA011/Chat-With-Me-CWM-.git
   cd chat-with-me
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore** and **Authentication** (Email/Password).
   - Add your Firebase configuration in `config/firebase.js`:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };
     ```

4. **Run the App**
   ```bash
   npx expo start
   ```
   - Scan the QR code with the Expo Go app (Android) or use an iOS simulator.

---

## Folder Structure

```
chat-with-me/
├── assets/               # Static assets (images, icons)
  ├── components/           # Reusable components (e.g., Chat, Header,...)
  ├── config/               # Configuration files (eg Firebase,...)
  ├── contants/             # Enums
  ├── layout/               # Custom layout
  ├── router/               # Route setup (Stack, Tab,...)
  ├── screens/              # App screens (e.g., Login, Chat, Profile,...)
  ├── models/               # Data models (e.g., User, Message,...)
├── App.js                # Main application entry point
├── LICENSE               # App license
└── README.md             # Project documentation
```

---

## Usage

### Sign Up
1. Open the app and navigate to the **Sign Up** screen.
2. Enter your email, password, and username.
3. Upload a profile picture (optional).
4. Click **Sign Up** to create your account.

### Log In
1. Open the app and navigate to the **Log In** screen.
2. Enter your email and password.
3. Click **Log In** to access your account.

### Add frind
1. Navigate to the **add chat** screen.
2. Then Navigate to the **people** screen.
3. Send friend request wait for it to be accepted
4. Navigate to the **add chat** screen then start chatting with friends.

### Chat
1. Navigate to the **Chat** screen.
2. Select a friend from your friend list.
3. Start sending messages in real-time.



### Setting
1. Navigate to the **Setting** screen.
2. Navigate to the **Update profile** screen.
2. Update your username, status, or profile picture.
3. Click **Save** to update your profile.

---

## Firebase Rules

### Firestore Rules
Ensure your Firestore rules allow read/write access for authenticated users:

### Authentication Rules
Ensure **Email/Password** authentication is enabled in your Firebase project.

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Firebase**: For providing a robust backend solution.
- **Expo**: For simplifying React Native development.
- **React Native Community**: For creating amazing libraries and tools.

---

## Contact

For questions or feedback, feel free to reach out:
- **Email**: ratshalingwaadivhaho106@gmail.com
- **GitHub**: [RACHA011](https://github.com/RACHA011/)

---

Enjoy chatting with **Chat With Me (CWM)**! 🚀
