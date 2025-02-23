import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useTheme } from '../layout/ThemeContext';

// Screens
import { SearchScreen } from '../components/chat/Header';
import { LoginScreen, ForgotPasswordScreen } from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ChatMessageScreen from '../screens/chat/ChatMessageScreen';
// import ChatScreen from '../screens/chat/ChatScreen';
import FriendRequestScreen from '../screens/friends/FriendRequestScreen';
import FriendsScreen from '../screens/friends/FriendsScreen';
import PeopleScreen from '../screens/friends/PeopleScreen';
import Home from '../screens/Home';
import { onStatusChanged } from '../config/handleconfigs/MessageConfig';
import Settings from '../screens/Settings';
import UpdateProfile from '../screens/user/UpdateProfile';
import ViewProfile from '../screens/user/ViewProfile';

// Navigation Components
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// onStatusChanged();

// Custom Tab Bar Button
const CustomTabBarButton = ({ onPress }) => {
  const { theme } = useTheme(); // Use theme

  return (
    <TouchableOpacity
      style={[styles.newChatButton, { backgroundColor: theme.colors.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.newChatText, { color: theme.colors.textInverse }]}>
        + New Chat
      </Text>
    </TouchableOpacity>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  const { theme } = useTheme(); // Use theme
  useEffect(() => {
    onStatusChanged(); // Call this when the app starts or when the user logs in
  });
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = focused ? 'home' : 'home-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: theme.colors.background },
        ],
        tabBarShowLabel: false,
        headerShown: false,
        headerBackground: theme.colors.background,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="NewChat"
        component={FriendsScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const StackNavigator = () => {
  useEffect(() => {
    onStatusChanged(); // Call this when the app starts or when the user logs in
  });
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="People"
        component={PeopleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen
        name="FriendRequest"
        component={FriendRequestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={UpdateProfile} />
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
      <Stack.Screen
        name="Message"
        component={ChatMessageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Root Navigation Container
const Router = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    position: 'absolute',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  newChatButton: {
    position: 'absolute',
    bottom: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newChatText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Router;
