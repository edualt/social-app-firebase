import auth from '@react-native-firebase/auth';
import IUserRepositoryPort from '../../application/ports/IUserRepositoryPort';
import User from '../../domain/entities/user';
import { firebaseAuth, firebaseDB } from '../../../config/firebase.config';
import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';

class UserRepositoryAdapter implements IUserRepositoryPort {
  async authenticate(user: User): Promise<User | null> {
    try {
      const userCredentials: UserCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        user.email,
        user.password,
      );

      const userEntity = await this.findById(userCredentials.user.uid);

      return userEntity;
    } catch (error) {
      return null;
    }
  }

  async create(user: User): Promise<User> {
    const userCredentials: UserCredential =
      await createUserWithEmailAndPassword(
        firebaseAuth,
        user.email,
        user.password,
      );

    const userData = {
      _id: userCredentials.user.uid,
      name: user.name,
      username: user.username,
      email: user.email,
      providerData: userCredentials.user.providerData[0],
    };

    setDoc(doc(firebaseDB, 'users', userCredentials.user.uid), userData);

    return new User(
      userCredentials.user.uid,
      user.name,
      user.username,
      user.email,
      '',
      userCredentials.user.providerData[0],
    );
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await getDoc(doc(firebaseDB, 'users', id));

    if (!userDoc.exists()) {
      return null;
    }

    const userEntity = User.fromFirebase(userDoc.data());

    return userEntity;
  }
}

export default UserRepositoryAdapter;