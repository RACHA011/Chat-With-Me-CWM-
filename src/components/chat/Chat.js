import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  checkStatus,
  getLastMessage,
} from '../../config/handleconfigs/MessageConfig';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme
import {fetchProfilePicture} from '../../config/handleconfigs/UserConfig'

const Chat = ({ item }) => {
  const [message, setMessage] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [picture, setPicture] = useState('');
  const navigation = useNavigation();
  const { theme } = useTheme(); // Use theme

  const fetchLastMessage = async () => {
    getLastMessage(item.id, (message) => {
      setMessage(message);
    });
  };

  useEffect(() => {
    const getProfilePicture = async (uid) => {
      const picture = await fetchProfilePicture(uid);
      setPicture(picture);
    };
    getProfilePicture(item.id);
  }, [picture]);
  

  const handleStatusUpdate = (status) => {
    setIsOnline(status === 'Online');
  };

  useEffect(() => {
    // Fetch initial message and set up real-time updates
    fetchLastMessage();
    
  });
  useEffect(() => {
    const fetchUserStatus = async () => {
      checkStatus(item.id, (status) => {
        setIsOnline(status === 'Online');
      });
    };

    fetchUserStatus();
  })

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const messageDate = new Date(timestamp);
    const isToday =
      now.getFullYear() === messageDate.getFullYear() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getDate() === messageDate.getDate();

    return isToday
      ? messageDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
      : messageDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          ...(messageDate.getFullYear() !== now.getFullYear() && {
            year: 'numeric',
          }),
        });
  };

  return (
    <TouchableOpacity
      style={[styles.chatItem, { borderBottomColor: theme.colors.border }]}
      onPress={() => navigation.navigate('Message', { item })}
    >
      <View style={styles.profilePicContainer}>
        <Image
          source={
            picture?.picture
              ? { uri: picture?.picture }
              : require('../../../assets/images/user.png')
          }
          style={styles.profilePic}
        />
        {isOnline && (
          <View
            style={[
              styles.onlineIndicator,
              { backgroundColor: theme.colors.success },
            ]}
          />
        )}
      </View>
      <View style={styles.chatInfo}>
        <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
          {item?.username}
        </Text>
        <Text
          style={[styles.lastMessage, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {message?.content?.data || 'No messages yet'}
        </Text>
      </View>
      <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
        {formatTime(message?.timestamp)}
      </Text>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  profilePicContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF', // Keep this white for contrast
  },
  chatInfo: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});

export default Chat;
