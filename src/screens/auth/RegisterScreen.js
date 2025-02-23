import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signUp } from '../../config/handleconfigs/AuthConfig';
import { fetchUsersId } from '../../config/handleconfigs/UserConfig';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme hook

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const validator = require('validator');
  const navigation = useNavigation();
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    const checkUserStatus = async () => {
      // Fetch user data from server and check if they're logged in
      const response = await fetchUsersId();
      if (response.uid) {
        navigation.replace('MainTabs');
      }
    };
    checkUserStatus();
  }, []);

  const handleRegister = async () => {
    setErrorMessage('');

    // Validate inputs
    if (!username || !email || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (!validator.isEmail(email)) {
      setErrorMessage('Invalid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // Start loading
    setLoading(true);

    try {
      const response = await signUp(email, password, username);

      if (response?.user) {
        Alert.alert(
          'Registration Successful',
          'You have been registered successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                setEmail('');
                setUsername('');
                setPassword('');
                navigation.navigate('MainTabs');
              },
            },
          ]
        );
      } else {
        // Handle API response errors
        const errorMessage = response?.message || 'Unknown error occurred';
        Alert.alert(
          'Registration Failed',
          errorMessage.includes('auth/email-already-in-use')
            ? 'Email already in use'
            : errorMessage
        );
      }
    } catch (error) {
      // Handle Firebase errors
      const firebaseError = error.message || '';
      let userMessage = 'Could not complete registration. Please try again.';

      if (firebaseError.includes('auth/email-already-in-use')) {
        userMessage = 'Email already in use';
      } else if (firebaseError) {
        userMessage = firebaseError.replace('Firebase: ', '');
      }

      console.error('Registration error:', error);
      Alert.alert('Registration Failed', userMessage);
    } finally {
      // Stop loading (whether success or failure)
      setLoading(false);
    }
  };

  // Dynamically generate styles based on the current theme
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    heading: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: 24,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: theme.colors.textPrimary,
    },
    icon: {
      marginRight: 10,
      color: theme.colors.textSecondary,
    },
    registerButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: width * 0.85,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 2,
    },
    registerButtonText: {
      color: theme.colors.textInverse,
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginText: {
      color: theme.colors.textSecondary,
      marginTop: 16,
      fontSize: 14,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 12,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Register</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="user" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="envelope" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textInverse} /> // Show spinner when loading
        ) : (
          <Text style={styles.registerButtonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

export default RegisterScreen;