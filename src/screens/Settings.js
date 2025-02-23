import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { signout } from '../config/handleconfigs/AuthConfig';
import {
  fetchProfilePicture,
  fetchUser,
  fetchUsersId,
} from '../config/handleconfigs/UserConfig';
import { useTheme } from '../layout/ThemeContext'; // Import useTheme
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const [userData, setUserData] = useState([]);
  const [picture, setPicture] = useState('');
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme(); // Use theme

  // Load user data and settings
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await fetchUser((await fetchUsersId()).uid);
      setUserData(user);
      const picture = await fetchProfilePicture((await fetchUsersId()).uid);
      setPicture(picture);
    };
    fetchUserData();
  }, []);

  const viewProfile = async () => {
    // Implementation for updating profile picture
    const temp = [];

    temp.push({
      ...userData,
      picture: picture?.picture || '', // Add the last message timestamp
    });

     navigation.navigate('ViewProfile', { item: temp })
  };

  const handleLogout = async () => {
    try {
      await signout();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Profile Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={viewProfile}>
          <Image
            source={
              picture.picture
                ? { uri: picture.picture }
                : require('../../assets/images/user.png')
            }
            style={styles.profileImage}
          />
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={[styles.editIcon, { backgroundColor: theme.colors.primary }]}
          >
            <MaterialIcons name="edit" size={21} color="white" />
          </Pressable>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputField}>
          <Text
            style={[styles.inputLabel, { color: theme.colors.textSecondary }]}
          >
            Username
          </Text>
          <Text
            style={[styles.inputValue, { color: theme.colors.textPrimary }]}
          >
            {userData.username}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputField}>
          <Text
            style={[styles.inputLabel, { color: theme.colors.textSecondary }]}
          >
            Status
          </Text>
          <Text
            style={[styles.inputValue, { color: theme.colors.textPrimary }]}
          >
            {userData.status}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Account Settings */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Account Settings
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.settingItem}
        >
          <MaterialIcons
            name="lock"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text
            style={[styles.settingText, { color: theme.colors.textPrimary }]}
          >
            Reset Password
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* App Settings */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          App Settings
        </Text>

        <View style={styles.settingItem}>
          <MaterialIcons
            name="dark-mode"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text
            style={[styles.settingText, { color: theme.colors.textPrimary }]}
          >
            Dark Mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={isDark ? theme.colors.primary : theme.colors.border}
          />
        </View>
      </View>

      {/* Logout Section */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.surface }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: theme.colors.error }]}>
          Log Out
        </Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          ChatApp v1.0.0
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          © 2025 ChatApp Inc.
        </Text>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    borderRadius: 15,
    padding: 5,
  },
  inputField: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 120,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 4,
  },
});

export default Settings;
