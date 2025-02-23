import { MessageType } from "../constants/Enum";


class Content {
  constructor(type, data) {
    if (!Object.values(MessageType).includes(type)) {
      throw new Error(`Invalid message type: ${type}`);
    }
    
    this.type = type; 
    this.data = data; 
  }
}

export default Content;
