import { Image, Text, View, Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import {
  addToFriendRequest,
  fetchProfilePicture,
  fetchUsersId,
} from '../../config/handleconfigs/UserConfig';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme

const User = ({ item }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const navigation = useNavigation(); // Initialize navigation
  const [userId, setUserId] = useState('');
  const [picture, setPicture] = useState('');
  const { theme } = useTheme(); // Use theme

  useEffect(() => {
    const getProfilePicture = async (uid) => {
      const picture = await fetchProfilePicture(uid);
      setPicture(picture);
    };
    getProfilePicture(item.id);
  }, [picture]);

  useEffect(() => {
    const getUserId = async () => {
      const data = await fetchUsersId();
      setUserId(data.uid);
    };
    getUserId();
  }, [userId]);

  const chackIfIsFriend = () => {
    if (item?.friends?.includes(userId)) {
      setIsFriend(true);
    }
  };

  const checkRequestSent = () => {
    if (item?.friendRequests?.includes(userId)) {
      setRequestSent(true);
    }
  };

  useEffect(() => {
    chackIfIsFriend();
    checkRequestSent();
  }, [userId]);

  const sendFriendRequest = async (id) => {
    if (!id) {
      console.error('Invalid user ID');
      return;
    }

    try {
      const response = await addToFriendRequest(id);
      if (response) {
        setRequestSent(true);
      } else {
        console.error(`Error sending friend request: ${response}`);
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handlePress = () => {
    if (isFriend) {
      // Navigate to the chat page if the user is a friend
      navigation.navigate('Message', { item: item });
    } else if (!requestSent) {
      // Send a friend request if the user is not a friend and no request has been sent
      sendFriendRequest(item.id);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.profilePicture}
          source={
            picture?.picture
              ? { uri: picture.picture } // Use the URI if available
              : require('../../../assets/images/user.png') // Fallback to local image
          }
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.username, { color: theme.colors.textPrimary }]}>
          {item?.username || 'Unknown User'}
        </Text>
      </View>
      <Pressable
        onPress={handlePress}
        style={[
          styles.addButton,
          isFriend && { backgroundColor: theme.colors.success }, // Green for friends
          requestSent &&
            !isFriend && { backgroundColor: theme.colors.textSecondary }, // Gray for sent requests
          !isFriend &&
            !requestSent && { backgroundColor: theme.colors.primary }, // Blue for add friend
        ]}
        disabled={requestSent && !isFriend}
      >
        <Text style={styles.addButtonText}>
          {isFriend ? 'Chat' : requestSent ? 'Request Sent' : 'Add Friend'}
        </Text>
      </Pressable>
    </View>
  );
};

export default User;

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: 105,
  },
  addButtonText: {
    textAlign: 'center',
    color: 'white', // Ensures text contrast
    fontSize: 13,
    fontWeight: 'bold',
  },
});
