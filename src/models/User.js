export class User {
  constructor(
    id = "",
    username = "",
    email = "",
    ppicture = "",
    friends = [],
    friendRequests = [],
    sentFriendRequests = [],
    status = "Hey there! I am using CWM",
    authorities = ""
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.ppicture = ppicture;
    this.friends = friends;
    this.friendRequests = friendRequests;
    this.sentFriendRequests = sentFriendRequests;
    this.status = status;
    this.authorities = authorities;
  }

  // Convert Firestore document to User object
  static fromFirestore(doc) {
    const data = doc.data();
    return new User(
      doc.id,
      data.username,
      data.email,
      data.ppicture,
      data.friends || [],
      data.friendRequests || [],
      data.sentFriendRequests || [],
      data.status || "Hey there! I am using CWM",
      data.authorities || ""
    );
  }

  // Convert User object to Firestore data
  toFirestore() {
    return {
      username: this.username,
      email: this.email,
      ppicture: this.ppicture,
      friends: this.friends,
      friendRequests: this.friendRequests,
      sentFriendRequests: this.sentFriendRequests,
      status: this.status,
      authorities: this.authorities,
    };
  }
}