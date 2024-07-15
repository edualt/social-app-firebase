import { addDoc, collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import IPostRepositoryPort from "../../application/ports/IPostRepositoryPort";
import Post from "../../domain/entities/post";
import { firebaseDB, firebaseStorage } from "../../../config/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Platform } from "react-native";

class PostRepositoryAdapter implements IPostRepositoryPort {
  async create(post: Post): Promise<Post> {
    const postData = {
      text: post.text,
      authorID: post.authorID,
      media: post.media,
      mediaType: post.mediaType,
      createdAt: post.createdAt,
    }

    const docRef = await addDoc(collection(firebaseDB, 'posts'), postData);

    return new Post(
      docRef.id,
      post.text,
      post.authorID,
      post.media,
      post.mediaType,
      post.createdAt
    );
  }

  async getAll(): Promise<Post[]> {
    const collectionRef = collection(firebaseDB, 'posts');

    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return new Post(
        doc.id,
        data.text,
        data.authorID,
        data.media,
        data.mediaType,
        data.createdAt
      );
    });

    return posts;
  }

  async uploadImage(imageUri: string): Promise<string> {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = ref(firebaseStorage, `images/${filename}`);
    const uploadUri =
      Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('Failed to load image URI'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uploadUri, true);
      xhr.send();
    });

    const snapshot = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(snapshot.ref);

    return url;
  }
}

export default PostRepositoryAdapter;