import { FieldValue } from "firebase/firestore";

class Post {
  id: string;
  text: string;
  authorID: string;
  media: string;
  mediaType: string;
  createdAt: FieldValue;

  constructor(id: string, text: string, authorID: string, media: string, mediaType: string, createdAt: FieldValue) {
    this.id = id;
    this.text = text;
    this.authorID = authorID;
    this.media = media;
    this.mediaType = mediaType;
    this.createdAt = createdAt;
  }

  toFirebase(){
    return {
      id: this.id,
      text: this.text,
      authorID: this.authorID,
      media: this.media,
      mediaType: this.mediaType,
      createdAt: this.createdAt
    }
  }

  static fromFirebase(data: any){
    return new Post(
      data.id,
      data.text,
      data.authorID,
      data.media,
      data.mediaType,
      data.createdAt
    )
  }
}

export default Post;  