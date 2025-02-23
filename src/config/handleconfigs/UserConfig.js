import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { User } from '../../models/User';
import { auth, db } from '../FirebaseConfigs'; // Import auth from FirebaseConfigs

const fetchusers = async () => {
  try {
    // Check if the user is authenticated
    const user = auth().currentUser;

    if (!user) {
      throw new Error('User is not authenticated.');
    }

    // Fetch users from Firestore
    const querySnapshot = await getDocs(collection(db, 'users'));
    const userData = [];
    querySnapshot.forEach((doc) => {
      userData.push({ id: doc.id, ...doc.data() });
    });

    return userData.filter((userId) => userId.id !== user.uid);
  } catch (error) {
    console.error('Firebase fetch-user error:', error);
    throw error;
  }
};

const fetchUsersId = async () => {
  try {
    // Check if the user is authenticated
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User is not authenticated.');
    }

    return user;
  } catch (error) {
    console.error('Firebase fetch-user-Id error:', error);
    throw error;
  }
};

const fetchUser = async (userId) => {
  try {
    // Check if userId is provided
    if (!userId) {
      throw new Error('User ID is required.');
    }

    // Reference to the user's document in the 'users' collection
    const userDocRef = doc(db, 'users', userId);

    // Fetch the user's document
    const userDoc = await getDoc(userDocRef);

    // Check if the document exists
    if (!userDoc.exists()) {
      throw new Error('User not found.');
    }

    // Return the user's data
    return User.fromFirestore(userDoc);
  } catch (error) {
    console.error('Firebase fetch-user error:', error);
    throw error;
  }
};

const fetchFriends = async () => {
  try {
    // Check if the user is authenticated
    const user = auth().currentUser;

    if (!user) {
      throw new Error('User is not authenticated.');
    }

    // Reference to the user's document in the 'users' collection
    const userDocRef = doc(db, 'users', user.uid);

    // Fetch the user's document
    const userDoc = await getDoc(userDocRef);

    // Check if the document exists
    if (!userDoc.exists()) {
      throw new Error('User not found.');
    }
    const userData = User.fromFirestore(userDoc).friends;

    const userFriends = await Promise.all(
      userData.map(async (doc) => await fetchUser(doc))
    );

    return userFriends;
  } catch (error) {
    console.error('Firebase fetch-user error:', error);
    throw error;
  }
};

const fetchFriendsRequest = async () => {
  try {
    // Check if the user is authenticated
    const user = auth().currentUser;

    if (!user) {
      throw new Error('User is not authenticated.');
    }

    // Reference to the user's document in the 'users' collection
    const userDocRef = doc(db, 'users', user.uid);

    // Fetch the user's document
    const userDoc = await getDoc(userDocRef);

    // Check if the document exists
    if (!userDoc.exists()) {
      throw new Error('User not found.');
    }
    const userData = User.fromFirestore(userDoc).friendRequests;

    const userFriendRequests = await Promise.all(
      userData.map(async (doc) => await fetchUser(doc))
    );

    return userFriendRequests;
  } catch (error) {
    console.error('Firebase fetch-user error:', error);
    throw error;
  }
};

const fetchProfilePicture = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }
    const userDocRef = doc(db, 'profilepictures', userId);

    // Fetch the user's document
    const userDoc = await getDoc(userDocRef);

    // Check if the document exists
    if (!userDoc.exists()) {
      throw new Error('User not found.');
    }
    return userDoc.data();
  } catch (error) {
    console.error('Error getting profile picture:', error.message);
    throw error;
  }
};

const addToFriendRequest = async (id) => {
  try {
    // Check if the user is authenticated
    const user = auth().currentUser;

    if (!user) {
      throw new Error('User is not authenticated.');
    }

    // Reference to the current user's document
    const userDocRef = doc(db, 'users', user.uid);
    const friendDocRef = doc(db, 'users', id);

    // Fetch the user's and friend's documents
    const userDoc = await getDoc(userDocRef);
    const friendDoc = await getDoc(friendDocRef);

    if (!userDoc.exists() || !friendDoc.exists()) {
      throw new Error('User or friend document does not exist.');
    }

    const userData = userDoc.data();
    const friendData = friendDoc.data();

    // If user is already a friend, throw an error
    if (userData.friends.includes(id)) {
      throw new Error('User is already in your friend list.');
    }

    // If user is in your friend request list and you are in their sent requests, accept the request
    if (
      userData.friendRequests.includes(id) &&
      friendData.sentFriendRequests.includes(user.uid)
    ) {
      // Add each other as friends
      await updateDoc(userDocRef, {
        friends: arrayUnion(id),
        friendRequests: arrayRemove(id), // Remove from friend requests
      });

      await updateDoc(friendDocRef, {
        friends: arrayUnion(user.uid),
        sentFriendRequests: arrayRemove(user.uid), // Remove from sent requests
      });

      console.log('Friend request accepted and added to friends list.');
    } else {
      // Send a friend request
      await updateDoc(userDocRef, {
        sentFriendRequests: arrayUnion(id),
      });

      await updateDoc(friendDocRef, {
        friendRequests: arrayUnion(user.uid),
      });

      console.log('Friend request sent successfully.');
    }
    return true;
  } catch (error) {
    console.error('Firebase add-to-friend-request error:', error);
    throw error;
  }
};

const saveUser = async (user, ppictureBytes) => {
  try {
    const newUser = new User(
      user.id,
      user.username,
      user.email,
      user.ppicture,
      user.friends, // friends
      user.friendRequests, // friendRequests
      user.sentFriendRequests, // sentFriendRequests
      user.status, // status
      user.authorities // authorities
    );
    const profilePicture = { picture: ppictureBytes };

    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.id), newUser.toFirestore());
    await setDoc(doc(db, 'profilepictures', user.id), profilePicture);

    console.log('User saved to Firestore:', user.username);
  } catch (error) {
    console.error('Error saving user:', error.message);
    throw error;
  }
};

export {
  addToFriendRequest,
  fetchFriends,
  fetchFriendsRequest,
  fetchUser,
  fetchusers,
  fetchUsersId,
  saveUser,
  fetchProfilePicture,
};
