import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { firebaseAuth, firebaseDB } from '../../../../config/firebase.config';
import {useEffect} from 'react';
import { useAppDispatch } from '../../redux/store/store';
import { AuthActionTypes } from '../../redux/actions/authActions';
import {doc, getDoc} from 'firebase/firestore';
import User from '../../../domain/entities/user';
import { RootStackParamList } from '../../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SplashScreenProps } from '../../../../App';
import Icon from 'react-native-vector-icons/Ionicons';

const SplashScreen = ({navigation}: SplashScreenProps) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    checkedLoggedUser();
  });

  const checkedLoggedUser = async () => {
    firebaseAuth.onAuthStateChanged(async user => {
      if (user) {
        const userDoc = await getDoc(doc(firebaseDB, 'users', user.uid));

        if (userDoc.exists()) {
          const userEntity = User.fromFirebase(userDoc.data());

          dispatch({type: AuthActionTypes.LOGIN, payload: userEntity});
          navigation.navigate('Home');
        }
      } else {
        navigation.navigate('Login');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="logo-flickr" size={100} color="#4C68D5" />
      <View style={styles.separator} />
      <ActivityIndicator size="large" color="#4C68D5" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
});

export default SplashScreen;
