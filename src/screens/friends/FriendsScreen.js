import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Friends from '../../components/Friends';
import {
  fetchFriends,
  fetchFriendsRequest,
  fetchUser,
  fetchUsersId,
} from '../../config/handleconfigs/UserConfig';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme

const FriendScreen = () => {
  const [friends, setFriends] = useState([]); // State for friends list
  const [friendRequests, setFriendRequests] = useState([]); // State for friend requests
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const navigation = useNavigation();
  const { theme } = useTheme(); // Use theme

  // Fetch friend requests
  useEffect(() => {
    const fetchFriendRequest = async () => {
      setTimeout(async () => {
        const friendRequest = await fetchFriendsRequest();
        setFriendRequests(friendRequest);
      }, 500); // Simulate a delay for better UX
    };

    fetchFriendRequest();
  }, [friendRequests]);

  // Fetch friends list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setTimeout(async () => {
          const fetchfriends = await fetchFriends();
          setFriends(fetchfriends);
          setIsLoading(false);
        }, 600); // Simulate a delay for better UX
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setIsLoading(false);
      }
    };
    fetchUsers();
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
      style={[
        styles.screenContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Friends
        </Text>
        <View style={styles.iconContainer}>
          {/* Navigate to People Screen */}
          <TouchableOpacity onPress={() => navigation.navigate('People')}>
            <Ionicons
              name="people-outline"
              size={28}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          {/* Navigate to Friend Requests Screen */}
          <TouchableOpacity
            onPress={() => navigation.navigate('FriendRequest')}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={theme.colors.textPrimary}
            />
            {/* Badge for Friend Requests */}
            {friendRequests?.length > 0 && (
              <View
                style={[styles.badge, { backgroundColor: theme.colors.error }]}
              >
                <Text style={styles.badgeText}>{friendRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Navigate to Search Screen */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Search', { item: friends })}
          >
            <Ionicons
              name="search-outline"
              size={26}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading friends...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Friends List */}
          <View style={styles.friendsListContainer}>
            {friends.length > 0 ? ( 
              friends.map((item, index) => <Friends key={index} item={item} />)
            ) : (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  No friends found
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default FriendScreen;

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Adds spacing between icons
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 75,
  },
  friendsListContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
});