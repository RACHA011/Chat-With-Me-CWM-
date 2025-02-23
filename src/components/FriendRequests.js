import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { addToFriendRequest, fetchProfilePicture } from '../config/handleconfigs/UserConfig';
import { useTheme } from '../layout/ThemeContext';

const FriendRequests = ({ item, friendRequest, setFriendRequest }) => {
  const navigation = useNavigation();
  const [showAcceptedMessage, setShowAcceptedMessage] = useState(false);
  const [picture, setPicture] = useState('');
  const {theme} = useTheme()

  useEffect(() => {
    const getProfilePicture = async (uid) => {
      const picture = await fetchProfilePicture(uid);
      setPicture(picture);
    };
    getProfilePicture(item.id);
  }, [picture]);
  
  const acceptFriendRequest = async (id) => {
    if (!id) {
      console.error('Invalid user ID');
      return;
    }
    try {
      const response = await addToFriendRequest(id);
      if (response) {
        console.log('Friend request accepted successfully');

        // Show the accepted message
        setShowAcceptedMessage(true);

        // Remove the accepted friend request from the state
        setFriendRequest((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );

        // Hide the accepted message after 3 seconds
        setTimeout(() => {
          setShowAcceptedMessage(false);
        }, 3000);
      } else {
        console.error('Failed to accept friend request:', response);
      }
    } catch (error) {
      console.error('Failed to accept friend request', error);
    }
  };

  return (
    <View>
      <Pressable style={styles.container}>
        <View>
          <Image
            style={styles.profilePicture}
            source={
              picture?.picture
                ? { uri: picture.picture } // Use the URI if available
                : require('../../assets/images/user.png') // Fallback to local image
            }
          />
        </View>

        <Text style={[styles.username, {color:theme.colors.messagecolor}]}>
          {item?.username} sent you a friend request
        </Text>

        <Pressable
          onPress={() => acceptFriendRequest(item.id)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Accept</Text>
        </Pressable>
      </Pressable>

      {showAcceptedMessage && (
        <View style={styles.acceptedMessageContainer}>
          <Text style={styles.acceptedMessageText}>Friend request accepted!</Text>
        </View>
      )}
    </View>
  );
};

export default FriendRequests;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 10,
    flex: 1,
  },
  addButton: {
    backgroundColor: '#0066b2',
    padding: 10,
    borderRadius: 6,
    width: 105,
  },
  addButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  acceptedMessageContainer: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  acceptedMessageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});