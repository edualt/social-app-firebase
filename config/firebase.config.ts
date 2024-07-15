import {FirebaseOptions, getApp, getApps, initializeApp} from 'firebase/app';
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getStorage} from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBEru_cXM99JO-_YUpzD3pxJrUuRwfhA9Q",
  authDomain: "aapp-79eec.firebaseapp.com",
  projectId: "aapp-79eec",
  storageBucket: "aapp-79eec.appspot.com",
  messagingSenderId: "553377683789",
  appId: "1:553377683789:web:27c528c70875adf6d4ff04",
  measurementId: "G-JCW62RHL0R"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const firebaseDB = getFirestore(app);
const firebaseStorage = getStorage(app);

export {app, firebaseAuth, firebaseDB, firebaseStorage};
