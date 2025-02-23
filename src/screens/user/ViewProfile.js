import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { useTheme } from '../../layout/ThemeContext';

export default function ViewProfile({ route }) {
  const { item } = route.params;
  const { theme } = useTheme(); // Use theme

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={[styles.section, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity >
          <Image
            source={
              item[0]?.picture
                ? { uri: item[0]?.picture }
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
          <Text
            style={[styles.inputValue, { color: theme.colors.textPrimary }]}
          >
            {item[0]?.username}
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
            {item[0]?.status}
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
    paddingBottom: 50,
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
