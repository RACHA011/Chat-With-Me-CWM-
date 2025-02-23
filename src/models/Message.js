export class Message {
  constructor(
    id = "",
    senderId = "",
    receiverId = "",
    content = { type: "TEXT", data: "" },
    timestamp = "",
    status = "SENT",
    read = true,
    chatType = "PERSON_TO_PERSON",
    chatRoomId = ""
  ) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.timestamp = timestamp;
    this.status = status;
    this.read = read;
    this.chatType = chatType;
    this.chatRoomId = chatRoomId;
  }

  // Convert Realtime Database snapshot to Message object
  static fromRealtimeDB(snapshot) {
    const data = snapshot.data; // Directly access the data object
    return new Message(
      snapshot.id, // Use the unique key from Realtime Database
      data.senderId,
      data.receiverId,
      data.content || { type: "TEXT", data: "" },
      data.timestamp,
      data.status || "SENT",
      data.read ?? true,
      data.chatType || "PERSON_TO_PERSON",
      data.chatRoomId
    );
  }

  // Convert Message object to Realtime Database data
  toRealtimeDB() {
    return {
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: this.content,
      timestamp: this.timestamp,
      status: this.status,
      read: this.read,
      chatType: this.chatType,
      chatRoomId: this.chatRoomId,
    };
  }
}