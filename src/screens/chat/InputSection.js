import React from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { Entypo, AntDesign, Feather } from '@expo/vector-icons';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme

const InputSection = ({ message, setMessage, pickImage, handleSend }) => {
  const { theme } = useTheme(); // Use theme

  return (
    <View
      style={[styles.inputContainer, { borderTopColor: theme.colors.border }]}
    >
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={[
          styles.textInput,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
          },
        ]}
        placeholder="Type your message..."
        placeholderTextColor={theme.colors.placeholder}
      />
      <View style={styles.iconGroup}>
        <AntDesign
          onPress={pickImage}
          style={styles.icon}
          name="camerao"
          size={24}
          color={theme.colors.textSecondary}
        />
        {/* <Feather
          style={styles.icon}
          name="mic"
          size={24}
          color={theme.colors.textSecondary}
        /> */}
      </View>
      {message.length > 0 && (
        <Pressable
          style={[
            styles.sendButton,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => handleSend('TEXT')}
        >
          <Text
            style={[
              styles.sendText,
              {
                color: theme.colors.textInverse,
              },
            ]}
          >
            Send
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = {
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export default InputSection;
