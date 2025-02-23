import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth, database } from '../FirebaseConfigs';
import { User } from '../../models/User';
import { ref, serverTimestamp, set } from 'firebase/database';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system'; // Import expo-file-system

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth(),
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

const signUp = async (email, password, username) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth(),
      email,
      password
    );
    const user = userCredential.user;

    // Create a new User object
    const newUser = new User(
      user.uid,
      username,
      email,
      '',
      [], // friends
      [], // friendRequests
      [], // sentFriendRequests
      'Hey there! I am using CWM', // status
      'USER' // authorities
    );

    // save a default profile picture
    const localFile = require('../../../assets/images/user.png');
    const asset = Asset.fromModule(localFile);
    await asset.downloadAsync(); // Ensure the asset is downloaded

    const fileUri = asset.localUri || asset.uri; // Get the file URI

    if (!fileUri) {
      throw new Error('Failed to resolve file URI');
    }

    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Construct the full base64 data URI with the correct MIME type
    const mimeType = 'image/png'; // Since the file is a PNG
    const base64DataUri = `data:${mimeType};base64,${base64}`;

    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), newUser.toFirestore());
    // console.log('User created and saved to Firestore:', username);

    const profilePicture = { picture: base64DataUri };

    await setDoc(doc(db, 'profilepictures', user.uid), profilePicture);
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

const signout = async () => {
  try {
    const user = auth().currentUser;
    if (!user) return;

    const userStatusRef = ref(database, `status/${user.uid}`);

    // Update the status to offline
    set(userStatusRef, {
      online: false,
      lastSeen: serverTimestamp(),
    }).catch((error) => {
      console.error('Error updating user status:', error);
    });

    await auth().signOut();
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Password reset error:', error.code, error.message);

    let errorMessage;
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later';
        break;
      default:
        errorMessage = 'Failed to send reset email. Please try again';
    }

    throw new Error(errorMessage);
  }
};

export { signIn, signUp, signout };
