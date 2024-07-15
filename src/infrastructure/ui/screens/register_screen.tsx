import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Touchable,
  Alert,
} from 'react-native';
import {AppButton} from '../components/button';
import {RegisterScreenProps} from '../../../../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {createUserUseCase} from '../../dependencies';

export const RegisterScreen = ({navigation}: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserUseCase.execute(email, password, name, username);
      Alert.alert('User created successfully');
      navigation.navigate('SplashScreen');
    } catch (error) {
      Alert.alert('Error creating user');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Image
        style={styles.image}
        source={require('../../../../assets/register.png')}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={text => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />

      <AppButton
        title="Register"
        onPress={() => {
          handleRegister();
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{textAlign: 'center', marginTop: 24}}>
          Have an account? <Text style={{color: '#4C68D5'}}>Log in</Text>
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
