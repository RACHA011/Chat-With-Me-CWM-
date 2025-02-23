import {
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { useTheme } from '../../layout/ThemeContext';
import React, { useEffect, useState } from 'react';
import {
  fetchProfilePicture,
  fetchUser,
  fetchUsersId,
} from '../../config/handleconfigs/UserConfig';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import * as FileSystem from 'expo-file-system'; // Import expo-file-system
import { saveUser } from '../../config/handleconfigs/UserConfig';

export default function UpdateProfile() {
  const [user, setUser] = useState(['']);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [ppicture, setPpicture] = useState('');
  const [picture, setPicture] = useState('');
  const [ppictureBytes, setPpictureBytes] = useState(null); // State to store image bytes
  const { theme } = useTheme();

  // Load user data and settings
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await fetchUser((await fetchUsersId()).uid);
      setUser(user);
      setUsername(user.username);
      setStatus(user.status);
      setPpicture(user.ppicture);
      const picture = await fetchProfilePicture((await fetchUsersId()).uid);
      setPicture(picture);
    };
    fetchUserData();
  }, []);

  // Request permission to access the media library
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert(
  //         'Permission Required',
  //         'Please grant permission to access the media library to upload a profile picture.'
  //       );
  //     }
  //   })();
  // }, []);

  // Handle image picker
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images', // Allow all image types
        allowsEditing: true, // Allow cropping
        aspect: [1, 1], // Square aspect ratio
        quality: 1, // Highest quality
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        // Get the file extension or MIME type from the URI
        const fileExtension = imageUri.split('.').pop(); // Extract file extension (e.g., "jpg", "png")
        const mimeType = `image/${fileExtension}`; // Construct MIME type (e.g., "image/jpeg", "image/png")

        // Read the image file as base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Construct the full base64 data URI with the correct MIME type
        const base64DataUri = `data:${mimeType};base64,${base64}`;

        // Set the image URI and base64 data
        setPpicture(imageUri);
        setPpictureBytes(base64DataUri); // Save the image as a base64 data URI
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  // Handle save
  const handlesave = async () => {
    console.log('save');
    const tempUser = user;
    tempUser.username = username;
    tempUser.status = status;

    // console.log('user:', user);

    await saveUser(user, ppictureBytes);
    // console.log('Image Bytes:', ppictureBytes); // Log the image bytes (base64)

    // Show an alert when the profile is saved
    Alert.alert('Success', 'Profile saved successfully!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={[styles.section, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              picture.picture
                ? { uri: picture.picture }
                : require('../../../assets/images/user.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputField}>
          <Text
            style={[styles.inputLabel, { color: theme.colors.textSecondary }]}
          >
            Username
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="username"
            placeholderTextColor={theme.colors.placeholder}
            value={username}
            onChangeText={setUsername}
            keyboardType="text"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputField}>
          <Text
            style={[styles.inputLabel, { color: theme.colors.textSecondary }]}
          >
            Status
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="status"
            placeholderTextColor={theme.colors.placeholder}
            value={status}
            onChangeText={setStatus}
            keyboardType="text"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handlesave}
        >
          <Text
            style={[styles.buttonText, { color: theme.colors.textInverse }]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    right: 10,
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
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
