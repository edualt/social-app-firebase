import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {AppButton} from '../components/button';
import Icon from 'react-native-vector-icons/Ionicons';
import {Post} from '../components/post';
import {HomeScreenProps} from '../../../../App';
import {
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {firebaseAuth} from '../../../../config/firebase.config';
import {serverTimestamp} from 'firebase/firestore';
import {
  createPostUseCase,
  findUserByIdUseCase,
  getAllPostsUseCase,
  uploadPostImageUseCase,
} from '../../dependencies';
import {pick, types} from 'react-native-document-picker';

export const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [postText, setPostText] = useState('');
  const [media, setMedia] = useState(null as any);
  const [posts, setPosts] = useState<any[]>([]);
  const [userFromDB, setUserFromDB] = useState(null as any);
  const [audio, setAudio] = useState(null as any);
  const user = firebaseAuth.currentUser;

  useLayoutEffect(() => {
    getAllPostsUseCase.execute().then(posts => {
      setPosts(posts);
    });

    if (user) {
      findUserByIdUseCase.execute(user.uid).then(user => {
        setUserFromDB(user);
      });
    } 
  }, [posts]);

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      setUserFromDB(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const onAddButtonPress = async () => {
    if (postText && postText.length > 0) {
      try {
        let mediaUrl = null;

        if (media && media.uri) {
          mediaUrl = await uploadPostImageUseCase.execute(media.uri);
        } else if (audio && audio.uri) {
          mediaUrl = await uploadPostImageUseCase.execute(audio.uri);
        }

        const timestamp = serverTimestamp();

        await createPostUseCase.execute(
          postText,
          user?.uid ?? '',
          mediaUrl ?? '',
          media?.type ?? audio?.type ?? '',
          timestamp,
        );

        setPostText('');
        setMedia(null);
        setAudio(null);
        Keyboard.dismiss();
      } catch (error) {
        console.log(error);
        Alert.alert('Error');
      }
    }
  };

  const editPost = (entity: any) => {
    console.log(entity);
  };

  const selectMedia = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed', // 'photo', 'video', 'mixed'
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedMedia = response.assets[0];
        setMedia(selectedMedia);
      }
    });
  };

  const selectAudio = async () => {
    try {
      const docs = await pick({
        type: [types.audio],
        allowMultiSelection: false,
      });      
      setAudio(docs[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hola {userFromDB?.username}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="exit-outline" size={20} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.createPostContainer}>
            <Image
              style={styles.image}
              source={require('../../../../assets/img.jpg')}
            />
            <View style={styles.subContainer}>
              <TextInput
                multiline
                numberOfLines={2}
                style={styles.textInput}
                placeholder="What's on your mind?"
                onChangeText={setPostText}
                value={postText}
              />

              <View style={styles.mediaContainer}>
                <TouchableOpacity onPress={selectMedia}>
                  <View style={styles.addMediaButton}>
                    <Icon name="image-outline" size={20} />
                    <Text style={styles.addMediaText}>Add media</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={selectAudio}>
                  <View style={styles.addMediaButton}>
                    <Icon name="musical-notes-outline" size={20} />
                    <Text style={styles.addMediaText}>Add audio</Text>
                  </View>
                </TouchableOpacity>
                <AppButton
                  title="Post"
                  borderRadius={100}
                  paddingHorizontal={25}
                  onPress={onAddButtonPress}
                />
              </View>
              {media && (
                <View style={styles.mediaPreviewContainer}>
                  <Image
                    source={{uri: media.uri}}
                    style={styles.mediaPreview}
                  />
                  <TouchableOpacity
                    onPress={() => setMedia(null)}
                    style={styles.removeMediaButton}>
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              {audio && (
                <View style={styles.mediaPreviewContainer}>
                  <Text>Audio cargado</Text>
                  <TouchableOpacity
                    onPress={() => setAudio(null)}
                    style={styles.removeMediaButton}>
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          {posts &&
            posts.map((entity: any) => (
              <Post
                key={entity.key}
                entity={entity}
                onEntityPress={() => editPost(entity)}
                currentUserId={user?.uid}
              />
            ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  createPostContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 20,
    borderBottomColor: '#ECF0F5',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  subContainer: {
    paddingRight: 70,
    width: '100%',
  },
  textInput: {
    textAlignVertical: 'top',
    borderBottomColor: '#ECF0F5',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMediaText: {
    marginLeft: 5,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginTop: 10,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 50,
  },
});
