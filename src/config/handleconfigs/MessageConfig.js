import { Message } from '../../models/Message';
import {
  ref,
  get,
  set,
  remove,
  query,
  onChildAdded,
  orderByKey,
  startAfter,
  limitToLast,
  onDisconnect,
  serverTimestamp,
  onValue,
} from 'firebase/database'; // Import modular functions
import { auth, database } from '../FirebaseConfigs'; // Ensure this is correctly set up

export const sendMessage = async (
  receiverId,
  content,
  chatType = 'PERSON_TO_PERSON',
  chatRoomId = ''
) => {
  try {
    const userId = auth().currentUser.uid; // Get the current user's ID

    // Generate or use the provided chat room ID
    const finalChatRoomId = chatRoomId || chatRoomGenerator(receiverId);

    // Get the current message count for the chat room
    const messageCountRef = ref(database, `messageCounts/${finalChatRoomId}`);
    const messageCountSnapshot = await get(messageCountRef);
    const messageCount = messageCountSnapshot.exists()
      ? messageCountSnapshot.val()
      : 0;

    // Create a new message object
    const message = new Message(
      (messageCount + 1).toString(), // Sequential ID
      userId,
      receiverId,
      content,
      new Date().toISOString(), // Current timestamp
      'SENT',
      false, // Message is unread by default
      chatType,
      finalChatRoomId
    );

    // Push the message to the Realtime Database under the chat room ID
    const messagesRef = ref(
      database,
      `messages/${finalChatRoomId}/${messageCount + 1}`
    ); // Reference to the chat room's messages
    await set(messagesRef, message.toRealtimeDB()); // Set the message data

    // Increment the message count
    await set(messageCountRef, messageCount + 1);

    return (messageCount + 1).toString(); // Return the sequential message ID
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const listenForMessages = (chatRoomId, lastMessageKey, callback) => {
  try {
    const messagesRef = ref(database, `messages/${chatRoomId}`);
    const messagesQuery = query(
      messagesRef,
      orderByKey(),
      startAfter(lastMessageKey)
    );
    // Listen for new messages in the chat room
    onChildAdded(messagesQuery, (snapshot) => {
      const messageData = snapshot.val();
      const newMessage = Message.fromRealtimeDB({
        id: snapshot.key,
        data: messageData,
      });
      callback(newMessage);
    });
  } catch (error) {
    console.error('Error listening for messages:', error.message || error);
    throw new Error('Failed to listen for messages. Please try again.');
  }
};

export const chatRoomGenerator = (receiverId) => {
  const senderId = auth().currentUser?.uid; // Optional chaining to avoid errors
  if (!senderId) {
    throw new Error('User is not authenticated.');
  }
  // Ensure the smaller ID comes first
  const sortedIds = [senderId, receiverId].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

export const loadInitialMessages = async (receiverId, callback) => {
  const chatRoomId = chatRoomGenerator(receiverId);
  const messagesRef = ref(database, `messages/${chatRoomId}`);
  const snapshot = await get(query(messagesRef, orderByKey()));

  const initialMessages = [];

  snapshot.forEach((childSnapshot) => {
    const messageData = childSnapshot.val();
    initialMessages.push(
      Message.fromRealtimeDB({
        id: childSnapshot.key,
        data: messageData,
      })
    );
  });

  const message = initialMessages;
  callback(message);
};

export const getLastMessage = async (receiverId, callback) => {
  try {
    const chatRoomId = chatRoomGenerator(receiverId); // Generate the chat room ID
    const messagesRef = ref(database, `messages/${chatRoomId}`); // Reference to the messages node

    // Query to get the last message
    const lastMessageQuery = query(messagesRef, orderByKey(), limitToLast(1));
    const snapshot = await get(lastMessageQuery);

    if (snapshot.exists()) {
      // Extract the last message
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        const lastMessage = Message.fromRealtimeDB({
          id: childSnapshot.key,
          data: messageData,
        });
        callback(lastMessage); // Pass the last message to the callback
      });
    } else {
      callback(null); // No messages found
    }
  } catch (error) {
    console.error('Error fetching the last message:', error);
    throw error; // Propagate the error for handling elsewhere
  }
};

export const removeMessage = async (messageList) => {
  const map = new Map();
  const successList = [];
  const failList = [];

  const deletePromises = messageList.map(async (message) => {
    const messageRef = ref(
      database,
      `messages/${message.chatRoomId}/${message.id}`
    );

    try {
      await remove(messageRef);

      return successList.push(`${message.chatRoomId} ${message.id}`);
    } catch {
      return failList.push(`${message.chatRoomId} ${message.id}`);
    }
  });

  // Wait for all deletions to complete
  await Promise.allSettled(deletePromises);

  // Update map after all removals finish
  map.set('success', successList);
  map.set('fail', failList);

  return map; // Return the final result
};

export const friendsMessagesId = async () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      console.log('User is not authenticated.');
      return {}; // Return an empty object if the user is not authenticated
    }

    const userId = user.uid; // Get the current user's ID

    // Reference to the messageCounts node
    const messageCountsRef = ref(database, 'messageCounts');
    const messageCountsSnapshot = await get(messageCountsRef);

    if (!messageCountsSnapshot.exists()) {
      console.log('No message counts found.');
      return {}; // Return an empty object if no message counts exist
    }

    // Get all chat room IDs and their message counts
    const chatRoomIds = messageCountsSnapshot.val();

    // Filter chat rooms where the current user is a participant
    const friendsIds = [];
    for (const chatRoomId in chatRoomIds) {
      if (chatRoomId.includes(userId)) {
        friendsIds.push(chatRoomId.replace(userId, '').replace('_', ''));
      }
    }

    // console.log('User chat rooms:', friendsIds);
    return friendsIds;
  } catch (error) {
    console.error('Error fetching friends messages:', error);
    throw error; // Propagate the error for handling elsewhere
  }
};

export const onStatusChanged = async () => {
  const user = auth().currentUser;
  if (!user) return;

  const userStatusRef = ref(database, `status/${user.uid}`);

  // Set up the onDisconnect handler first
  onDisconnect(userStatusRef).set({
    online: false,
    lastSeen: serverTimestamp(),
  });

  // Mark the user as online
  set(userStatusRef, {
    online: true,
    lastSeen: serverTimestamp(),
  }).catch((error) => {
    console.error('Error updating user status:', error);
  });
};

export const checkStatus = (userId, callback) => {
  const userStatusRef = ref(database, `/status/${userId}`);

  const unsubscribe = onValue(userStatusRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val().online ? 'Online' : 'Offline');
    } else {
      callback('Offline');
    }
  });

  return unsubscribe; // Return the unsubscribe function
};
