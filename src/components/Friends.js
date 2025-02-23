import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../layout/ThemeContext';
import { fetchProfilePicture } from '../config/handleconfigs/UserConfig';

const Friends = ({ item }) => {
  const navigation = useNavigation();
  const [picture, setPicture] = useState('');

  useEffect(() => {
    const getProfilePicture = async (uid) => {
      const picture = await fetchProfilePicture(uid);
      setPicture(picture);
    };
    getProfilePicture(item.id);
  }, [picture]);
  
  const { theme } = useTheme();

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('Message', { item: item })}
    >
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
      <View style={styles.chatInfo}>
        <Text style={[styles.username, {color:theme.colors.messagecolor}]}>{item.username}</Text>
      </View>
    </Pressable>
  );
};

export default Friends;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // resizeMode: "cover",
  },

  chatInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
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
});
