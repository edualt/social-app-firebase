import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {AppButton} from '../components/button';
import {LoginScreenProps} from '../../../../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {authenticateUserUseCase} from '../../dependencies';
import {useAppDispatch} from '../../redux/store/store';
import {AuthActionTypes} from '../../redux/actions/authActions';
import firestore from '@react-native-firebase/firestore';

export const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    const userEntity = await authenticateUserUseCase.execute(
      email,
      password,
    );

    if (!userEntity) {
      console.log('User not found');
      return;
    }

    dispatch({type: AuthActionTypes.LOGIN, payload: userEntity});

    console.log('User logged in');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Image
        style={styles.image}
        source={require('../../../../assets/login.png')}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <Text style={{textAlign: 'right', marginBottom: 48}}>
        Always use a safe password!
      </Text>
      <AppButton title="Log in" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{textAlign: 'center', marginTop: 24}}>
          Don't have an account? <Text style={{color: '#4C68D5'}}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    height: 44,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#707988',
  },
  image: {
    height: 138,
    alignSelf: 'center',
    marginBottom: 24,
  },
});
