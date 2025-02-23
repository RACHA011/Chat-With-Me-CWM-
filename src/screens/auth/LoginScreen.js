// src/screens/AuthScreens.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../layout/ThemeContext';
import { commonStyles } from '../../layout/Theme';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  resetPassword,
  signIn,
} from '../../config/handleconfigs/AuthConfig.js';
import { fetchUsersId } from '../../config/handleconfigs/UserConfig.js';
import validator from 'validator';

const LoginScreen = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserStatus = async () => {
      const response = await fetchUsersId();
      if (response.uid) {
        navigation.replace('MainTabs');
      }
    };
    checkUserStatus();
  }, []);

  const handleLogin = async () => {
    setLoginError('');

    if (!validator.isEmail(email)) {
      setLoginError('Invalid email address');
      return;
    }

    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters long');
      return;
    }

    try {
      const user = await signIn(email, password);
      navigation.navigate('MainTabs');
      setEmail('');
      setPassword('');
      console.log(`${user.email} logged in successfully`);
    } catch (error) {
      console.error('Login error:', error.code);
      let errorMessage = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Account temporarily disabled';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials';
          break;
      }
      setLoginError(errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Image
          source={require('../../../assets/images/user.png')}
          style={styles.logo}
        />

        <View style={styles.inputWrapper}>
          <Icon
            name="envelope"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.icon}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={theme.colors.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon
            name="lock"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.icon}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={theme.colors.placeholder}
            value={password}
            autoCapitalize="none"
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogin}
        >
          <Text
            style={[styles.buttonText, { color: theme.colors.textInverse }]}
          >
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.linkContainer}
        >
          <Text style={[styles.linkText, { color: theme.colors.secondary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister} style={styles.linkContainer}>
          <Text
            style={[styles.linkText, { color: theme.colors.textSecondary }]}
          >
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      if (!validator.isEmail(email)) {
        alert('Invalid email address');
        return;
      }
      await resetPassword(email);
      // Show success message
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      // Show error message to user
      alert(error.message);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Reset Password
        </Text>

        <Text
          style={[styles.instructions, { color: theme.colors.textSecondary }]}
        >
          Enter your email to receive a password reset link
        </Text>

        <TextInput
          style={{
            backgroundColor: theme.colors.inputBg,
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border,
            borderRadius: commonStyles.card.borderRadius,
            padding: commonStyles.card.padding,
            height: 50,
          }}
          placeholder="Email"
          placeholderTextColor={theme.colors.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          onPress={handlePasswordReset}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          <Text
            style={[styles.buttonText, { color: theme.colors.textInverse }]}
          >
            Send Reset Link
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.linkContainer}
        >
          <Text
            style={[styles.linkText, { color: theme.colors.textSecondary }]}
          >
            Go Back 
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 10,
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
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    fontSize: 14,
  },
});

export { LoginScreen, ForgotPasswordScreen };
