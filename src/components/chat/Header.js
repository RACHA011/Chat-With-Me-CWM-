import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { friendsMessagesId } from '../../config/handleconfigs/MessageConfig';
import { fetchFriends } from '../../config/handleconfigs/UserConfig';
import Chat from './Chat';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme

// Header Component
const Header = () => {
  const navigation = useNavigation();
  const [friendsIds, setFriendsIds] = useState([]);
  const [friends, setFriends] = useState([]);
  const { theme } = useTheme(); // Use theme

  const fetchfriendsId = async () => {
    const friendsIds = await friendsMessagesId();
    setFriendsIds(friendsIds);
    // fetch
    const friendsList = await fetchFriends();
    const TempFriendsList = [];
    friendsList.forEach((user) => {
      if (friendsIds.includes(user.id)) {
        TempFriendsList.push(user);
      }
    });
    setFriends(TempFriendsList);
  };

  useEffect(() => {
    fetchfriendsId();
  }, []);


  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        CWM
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Search', { item: friends })}
        style={styles.searchIcon}
      >
        <Ionicons
          name="search"
          size={24}
          color={theme.colors.textPrimary} // Use theme color
        />
      </TouchableOpacity>
    </View>
  );
};

// Search Screen Component
const SearchScreen = ({ route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { item } = route.params;
  const { theme } = useTheme(); // Use theme

  const filteredChats = item.filter((chat) =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.inputBg,
              color: theme.colors.textPrimary,
            },
          ]}
          placeholder="Search for a Friend..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id} // Use item.id as the key
        renderItem={({ item }) => <Chat item={item} />}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // You can replace this with theme.colors.border if needed
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchIcon: {
    padding: 8,
  },
  container: {
    flex: 1,
    paddingTop: 30,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // You can replace this with theme.colors.border if needed
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 4,
  },
});

export { Header, SearchScreen };
