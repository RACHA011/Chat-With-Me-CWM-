import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';
import {
  chatRoomGenerator,
  loadInitialMessages,
  removeMessage,
  sendMessage,
} from '../../config/handleconfigs/MessageConfig';
import { MessageType } from '../../constants/Enum';
import Header from './Header';
import InputSection from './InputSection';
import MessageList from './MessageList';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme hook

const ChatMessageScreen = ({ route }) => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [lastMessageKey, setLastMessageKey] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const navigation = useNavigation();
  const { item } = route.params;
  const [receiverId] = useState(item.id);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [fail, setFail] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [video, setVideo] = useState('');
  const [voice, setVoice] = useState('');
  const [file, setFile] = useState('');
  const [chatRoomId, setChatRoomId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const { theme } = useTheme(); // Get the current theme

  // Scroll handling
  const scrollToButtom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleConntentSizeChange = () => {
    scrollToButtom();
  };

  // Chat room initialization
  const getChatRoomId = async () => {
    try {
      const chatRoom = chatRoomGenerator(receiverId);
      setChatRoomId(chatRoom);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  // Message handling
  useEffect(() => {
    const initializeMessages = async () => {
      try {
        loadInitialMessages(receiverId, (message) => {
          if (message.length > 0) {
            setLastMessageKey(message[message.length - 1].id);
          }
          setMessages(message);
        });
      } catch (error) {
        console.error('Error initializing messages:', error);
      }
    };

    getChatRoomId();
    initializeMessages();
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true); // Set keyboard visibility to true when keyboard is shown
        setShowEmojiSelector(false); // Hide emoji selector when keyboard is shown
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false); // Set keyboard visibility to false when keyboard is hidden
      }
    );

    // Clean up listeners when the component unmounts
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Message deletion
  const handleDelete = async () => {
    try {
      const responseMap = await removeMessage(selectedMessage);
      setDeletedMessages(responseMap.get('success') || []);
      setFail(responseMap.get('fail') || []);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      setSelectedMessage([]);
    } catch (err) {
      console.error('Failed to delete messages:', err);
    }
  };

  // Image handling
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
      });

      if (!result.canceled) {
        const imageResult = result.assets[0];
        handleSend('IMAGE', imageResult);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Message sending
  const handleSend = async (messageType, fileBytes) => {
    try {
      let content = {};

      switch (messageType) {
        case MessageType.TEXT.toString():
          content = { type: MessageType.TEXT.toString(), data: message };
          break;
        case 'IMAGE':
          content = {
            type: messageType,
            data: fileBytes,
          };
          break;
        // Add cases for VIDEO/VOICE/FILE if needed
        default:
          console.error('Invalid message type:', messageType);
          return;
      }

      sendMessage(receiverId, content)
        .then(() => {
          setMessage(''); // Clear the message input
          setFile(''); // Clear the file
          setVideo(''); // Clear the video
          setVoice('');
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
        });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Time formatting
  const formatTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);

    // Check if the timestamp is from today
    const isToday =
      now.getFullYear() === messageDate.getFullYear() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getDate() === messageDate.getDate();

    if (isToday) {
      // Return time if it's from today
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    } else {
      // Return date if it's from another day
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year:
          messageDate.getFullYear() !== now.getFullYear()
            ? 'numeric'
            : undefined,
      });
    }
  };

  // Message selection
  const handleSelectedMessage = (message) => {
    const isSelected = selectedMessage.some(
      (item) => item.id === message.id && item.chatRoomId === message.chatRoomId
    );

    setSelectedMessage((prev) =>
      isSelected
        ? prev.filter((item) => item.id !== message.id)
        : [...prev, { id: message.id, chatRoomId: message.chatRoomId }]
    );
  };

  // Dynamically generate styles based on the current theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundbg,
    },
    modalContainer: {
      backgroundColor: theme.colors.error + '20', // Slight transparency
      borderColor: theme.colors.error,
      borderWidth: 1,
      borderRadius: 12,
      width: '90%',
      alignSelf: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      marginBottom: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    modalText: {
      color: theme.colors.error,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        navigation={navigation}
        item={item}
        selectedMessage={selectedMessage}
        handleDelete={handleDelete}
      />

      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1 }}
            onContentSizeChange={handleConntentSizeChange}
          >
            {/* Deletion Status Modal */}
            {modalVisible && (
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>
                  {deletedMessages.length || 'No'} Message deleted
                  {fail.length ? `, ${fail.length} failed` : ''}
                </Text>
              </View>
            )}

            <MessageList
              messages={messages}
              receiverId={receiverId}
              handleSelectedMessage={handleSelectedMessage}
              selectedMessage={selectedMessage}
              formatTime={formatTime}
            />
          </ScrollView>
        </TouchableWithoutFeedback>

        <InputSection
          message={message}
          setMessage={setMessage}
          pickImage={pickImage}
          handleSend={handleSend}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatMessageScreen;