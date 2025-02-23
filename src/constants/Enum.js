const ChatType = Object.freeze({
  PERSON_TO_PERSON: 'PERSON_TO_PERSON',
  GROUP: 'GROUP',
});

const MessageStatus = Object.freeze({
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
});

const MessageType = Object.freeze({
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  VOICE: 'VOICE',
  FILE: 'FILE',
});

const Status = Object.freeze({
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
});

export { Status, MessageType, ChatType, MessageStatus };
