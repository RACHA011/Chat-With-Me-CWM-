import React, { useEffect, useState } from 'react';
import { View, Pressable, Image, Text } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme
import { checkStatus } from '../../config/handleconfigs/MessageConfig';
import { fetchProfilePicture } from '../../config/handleconfigs/UserConfig';

const Header = ({ navigation, item, selectedMessage, handleDelete }) => {
  const { theme } = useTheme(); // Use theme
  const [isOnline, setIsOnline] = useState(false);
  const [picture, setPicture] = useState('');
  const navigations = useNavigation();

  useEffect(() => {
    const fetchUserStatus = async () => {
      checkStatus(item.id, (status) => {
        setIsOnline(status === 'Online');
      });
    };

    fetchUserStatus();
  });

  useEffect(() => {
    const getProfilePicture = async (uid) => {
      const picture = await fetchProfilePicture(uid);
      setPicture(picture);
    };
    getProfilePicture(item.id);
  }, [picture]);
  
  const viewProfile = async () => {
    // Implementation for updating profile picture
    const userData = item;
    const temp = [];

    temp.push({
      ...userData,
      picture: picture?.picture || '', // Add the last message timestamp
    });

    navigations.navigate('ViewProfile', { item: temp })
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color={theme.colors.textSecondary}
          />
        </Pressable>
        {selectedMessage.length > 0 ? (
          <View>
            <Text
              style={{
                marginLeft: 5,
                fontSize: 16,
                fontWeight: '500',
                color: theme.colors.textPrimary,
              }}
            >
              {selectedMessage.length}
            </Text>
          </View>
        ) : (
          <Pressable onPress={viewProfile}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
          >
            <View>
              <Image
                source={
                  picture?.picture
                    ? { uri: picture.picture }
                    : require('../../../assets/images/user.png')
                }
                style={{
                  position: 'relative',
                  width: 45,
                  height: 45,
                  borderRadius: 15,
                  resizeMode: 'cover',
                }}
              />
              {isOnline && (
                <View
                  style={[
                    styles.onlineIndicator,
                    { backgroundColor: theme.colors.success },
                  ]}
                />
              )}
            </View>

            <Text
              style={{
                marginLeft: 5,
                fontSize: 18,
                fontWeight: 'bold',
                color: theme.colors.textPrimary,
              }}
            >
              {item?.username}
            </Text>
          </Pressable>
        )}
      </View>
      <View>
        {selectedMessage.length > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            {/* <Pressable>
              <Ionicons
                name="arrow-undo"
                size={30}
                color={theme.colors.textPrimary}
              />
            </Pressable>
            <Pressable>
              <Ionicons
                name="arrow-redo"
                size={30}
                color={theme.colors.textPrimary}
              />
            </Pressable>
            <Pressable>
              <FontAwesome
                name="star"
                size={30}
                color={theme.colors.textPrimary}
              />
            </Pressable> */}
            <Pressable onPress={handleDelete}>
              <MaterialIcons
                name="delete"
                size={30}
                color={theme.colors.textPrimary}
              />
            </Pressable>
          </View>
        ) : (
          <Pressable>
            <MaterialIcons
              name="menu"
              size={30}
              color={theme.colors.textPrimary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 13,
    elevation: 2,
    paddingTop: 35,
    borderBottomWidth: 1,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF', // Keep this white for contrast
  },
};

export default Header;
