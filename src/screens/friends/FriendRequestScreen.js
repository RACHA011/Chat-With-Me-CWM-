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
import FriendRequests from '../../components/FriendRequests';
import { fetchFriendsRequest } from '../../config/handleconfigs/UserConfig';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme

const FriendRequestScreen = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const navigation = useNavigation();
  const { theme } = useTheme(); // Use theme

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchFriendsRequest();
        setFriendRequest(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, [friendRequest]);

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back-sharp"
            size={26}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={[styles.headerText, { color: theme.colors.textPrimary }]}>
          Your Friend Requests
        </Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {friendRequest.length > 0 ? (
          <View style={styles.requestListContainer}>
            {friendRequest.map((item, index) => (
              <FriendRequests
                key={index}
                item={item}
                friendRequest={friendRequest}
                setFriendRequest={setFriendRequest}
              />
            ))}
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading friend requests...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FriendRequestScreen;

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: '25%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  requestListContainer: {
    flex: 1,
    paddingTop: 10,
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
  backIcon: {
    paddingLeft: 8,
  },
});