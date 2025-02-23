import React from 'react';
import { View, Pressable, Text } from 'react-native';
import FileImage from '../../components/FileImage';
import { useTheme } from '../../layout/ThemeContext'; // Import useTheme

const MessageList = ({
  messages,
  receiverId,
  handleSelectedMessage,
  selectedMessage,
  formatTime,
}) => {
  const { theme } = useTheme(); // Use theme

  return (
    <View>
      {messages.map((item, index) => {
        const isSelected = selectedMessage.some(
          (items) =>
            items.id === item.id && items.chatRoomId === item.chatRoomId
        );

        // Common styles for both TEXT and IMAGE messages
        const messageContainerStyle = [
          item?.receiverId !== receiverId
            ? {
                alignSelf: 'flex-start',
                backgroundColor: theme.colors.receiverbg, // Use surface color for received messages
                padding: 10,
                maxWidth: '60%',
                borderRadius: 8,
                margin: 5,
              }
            : {
                alignSelf: 'flex-end',
                backgroundColor: theme.colors.senderbg, // Use primary color for sent messages
                padding: 10,
                maxWidth: '60%',
                borderRadius: 8,
                margin: 5,
              },
          isSelected && {
            backgroundColor: theme.colors.selectbg, // Use accent color for selected messages
          },
        ];

        const timestampStyle = {
          fontSize: 9,
          textAlign: 'right',
          color: theme.colors.timestampbg, // Use secondary text color for timestamps
          marginTop: 5,
        };

        if (item.content.type === 'TEXT') {
          return (
            <View key={index}>
              <Pressable
                onLongPress={() => handleSelectedMessage(item)}
                style={messageContainerStyle}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? 'right' : 'left',
                    color:
                      item?.receiverId !== receiverId
                        ? theme.colors.messagecolor
                        : theme.colors.messagecolor,
                  }}
                >
                  {item.content.data}
                </Text>
                <Text style={timestampStyle}>{formatTime(item.timestamp)}</Text>
              </Pressable>
            </View>
          );
        }

        if (item.content.type === 'IMAGE') {
          return (
            <Pressable key={index} style={messageContainerStyle}>
              <View>
                <FileImage fileId={item.content.data} />
                <Text style={timestampStyle}>{formatTime(item.timestamp)}</Text>
              </View>
            </Pressable>
          );
        }

        return null; // Handle other message types if needed
      })}
    </View>
  );
};

export default MessageList;
