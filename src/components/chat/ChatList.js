import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ScrollView } from 'react-native';
import {
  friendsMessagesId,
  getLastMessage,
} from '../../config/handleconfigs/MessageConfig'; // Import getLastMessage
import {
  fetchFriends,
  fetchUser,
  fetchUsersId,
} from '../../config/handleconfigs/UserConfig';
import Chat from './Chat';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
  const [friendsIds, setFriendsIds] = useState([]);
  const [friends, setFriends] = useState([]);
  const { theme } = useTheme(); // Use theme
  const navigation = useNavigation();

  const fetchfriendsId = async () => {
    const friendsIds = await friendsMessagesId();
    setFriendsIds(friendsIds);

    // Fetch friends list
    const friendsList = await fetchFriends();
    const TempFriendsList = [];

    // Fetch the last message for each friend and add it to the friend object
    for (const user of friendsList) {
      if (friendsIds.includes(user.id)) {
        const lastMessage = await new Promise((resolve) => {
          getLastMessage(user.id, (message) => {
            resolve(message);
          });
        });

        TempFriendsList.push({
          ...user,
          lastMessageTimestamp: lastMessage?.timestamp || null, // Add the last message timestamp
        });
      }
    }

    // Sort friends by the last message timestamp in descending order
    TempFriendsList.sort((a, b) => {
      // Get the date strings for comparison
      const dateA = a.lastMessageTimestamp
        ? new Date(a.lastMessageTimestamp).toDateString()
        : '';
      const dateB = b.lastMessageTimestamp
        ? new Date(b.lastMessageTimestamp).toDateString()
        : '';

      // Get the timestamps for comparison
      const timestampA = a.lastMessageTimestamp
        ? new Date(a.lastMessageTimestamp).getTime()
        : 0;
      const timestampB = b.lastMessageTimestamp
        ? new Date(b.lastMessageTimestamp).getTime()
        : 0;

      if (dateA === dateB) {
        // If the dates are the same, sort by time (latest first)
        return timestampB - timestampA;
      } else {
        // If the dates are different, sort by date (latest first)
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
    });

    setFriends(TempFriendsList);
  };

  useEffect(() => {
    fetchfriendsId();
  }, [friends]);

  useEffect(() => {
    // Check if the user has friends
    const checkFriendStatus = async () => {
      try {
        const user = await fetchUser((await fetchUsersId()).uid);

        // If the user has no friends, navigate to the People screen
        if (user.friends && user.friends.length === 0) {
          navigation.navigate('People');
        }
      } catch (error) {
        console.error('Error checking friend status:', error);
      }
    };

    checkFriendStatus();
  }, []);
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.scrollContainer}>
        {friends.length > 0 ? (
          <View style={styles.requestListContainer}>
            {friends.map((item, index) => (
              <Chat key={index} item={item} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No chat found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    alignContent: 'center',
  },
  requestListContainer: {
    flex: 1,
  },
});

export default ChatList;
