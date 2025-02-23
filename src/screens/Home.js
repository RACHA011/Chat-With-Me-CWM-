import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// import Header from '../components/chat/Header';
import ChatList from '../components/chat/ChatList';
import { Header } from '../components/chat/Header';
import { useTheme } from '../layout/ThemeContext';
import { fetchUser, fetchUsersId } from '../config/handleconfigs/UserConfig';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const { theme } = useTheme();

 
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header />
      <ChatList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  // ScrollView: {
  //   marginBottom: 100,
  // },
});

export default Home;
