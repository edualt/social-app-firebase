import { useLayoutEffect, useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firebaseDB } from '../../../../config/firebase.config';
import { findUserByIdUseCase } from '../../dependencies';
import timeSince from '../utils/timeSince';
import Sound from 'react-native-sound';

export const Post = ({
  entity,
  onEntityPress,
  currentUserId,
}: {
  entity: any;
  onEntityPress: any;
  currentUserId?: string;
}) => {
  const [user, setUser] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<Sound | null>(null);
  const [editableText, setEditableText] = useState(entity.text);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    setEditableText(entity.text);
  }, [entity.text]);

  const generateSound = () => {
    if (entity.media && entity.mediaType === 'audio/mpeg') {
      const sound = new Sound(entity.media, undefined, error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        setAudio(sound);
      });

      return () => {
        if (sound) {
          sound.release();
        }
      };
    }
  };

  useLayoutEffect(() => {
    findUserByIdUseCase.execute(entity.authorID).then(user => {
      setUser(user);
    });

    if (entity.id && currentUserId) {
      const likesRef = collection(firebaseDB, 'likes');

      const q = query(
        likesRef,
        where('postID', '==', entity.id),
        where('userID', '==', currentUserId),
      );
      const unsubscribeLike = onSnapshot(q, snapshot => {
        setIsLiked(!snapshot.empty);
      });

      generateSound();

      return () => {
        unsubscribeLike();
      };
    }
  }, [entity.id, entity.authorID, currentUserId]);

  const likePost = async () => {
    const likesRef = collection(firebaseDB, 'likes');

    try {
      if (isLiked) {
        const q = query(
          likesRef,
          where('postID', '==', entity.id),
          where('userID', '==', currentUserId),
        );
        const likeSnapshot = await getDocs(q);
        likeSnapshot.forEach(doc => {
          deleteDoc(doc.ref);
        });
      } else {
        if (entity.id && currentUserId) {
          await addDoc(likesRef, {
            postID: entity.id,
            userID: currentUserId,
          });
        } else {
          console.error('postID or userID is undefined');
        }
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const deletePost = async () => {
    try {
      const postRef = doc(firebaseDB, 'posts', entity.id);
      await deleteDoc(postRef);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleEditModal = () => {
    setIsEditModalVisible(!isEditModalVisible);
  };

  const handleTextChange = (text: string) => {
    setEditableText(text);
  };

  const saveText = async () => {
    try {
      const postRef = doc(firebaseDB, 'posts', entity.id);
      await updateDoc(postRef, { text: editableText });
      toggleEditModal();
    } catch (error) {
      console.error('Error updating post text:', error);
    }
  };

  const playPauseAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play(success => {
          if (success) {
            console.log('Finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {entity && (
        <>
          <View style={styles.createPostContainer}>
            {currentUserId === entity.authorID ? (
              <Image
              style={styles.image}
              source={require('../../../../assets/img.jpg')}
            />
            ) : (
              <Image
              style={styles.image}
              source={require('../../../../assets/img.png')}
            />
            )}

            <View style={styles.subContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>
                  {user?.username}
                </Text>
                <TouchableOpacity onPress={toggleModal}>
                  <Icon name="ellipsis-horizontal-outline" size={20} />
                </TouchableOpacity>
              </View>
              <Text>
                {entity.createdAt
                  ? timeSince(entity.createdAt.toDate())
                  : 'Just now'}
              </Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={{ color: '#27364B' }}>{entity.text}</Text>
          </View>
          {entity.media && entity.mediaType === 'image/jpeg' && (
            <View style={styles.mediaContainer}>
              <Image source={{ uri: entity.media }} style={styles.media} />
            </View>
          )}
          {entity.media && entity.mediaType === 'video/mp4' && (
            <View style={styles.mediaContainer}>
              <Video
                source={{ uri: entity.media }}
                style={styles.media}
                controls
              />
            </View>
          )}
          {entity.media && entity.mediaType === 'audio/mpeg' && (
            <View style={styles.mediaContainer}>
              <TouchableOpacity onPress={playPauseAudio}>
                <Icon
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={50}
                />
              </TouchableOpacity>
            </View>
          )}
          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            {currentUserId === entity.authorID ? (
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  onPress={() => {
                    toggleModal();
                    toggleEditModal();
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="pencil-outline" size={20} />
                    <Text style={styles.modalOption}>Edit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    toggleModal();
                    deletePost();
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="trash-outline" size={20} />
                    <Text style={styles.modalOption}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  onPress={() => {
                    toggleModal();
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="flag-outline" size={20} />
                    <Text style={styles.modalOption}>Report</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Modal>
          <Modal isVisible={isEditModalVisible} onBackdropPress={toggleEditModal}>
            <View style={styles.editModalContainer}>
              <TextInput
                style={styles.textInput}
                value={editableText}
                onChangeText={handleTextChange}
                multiline
              />
              <TouchableOpacity onPress={saveText}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
      {deleteSuccess && (
        <Text style={styles.successMessage}>Successfully deleted</Text>
      )}
      <View style={styles.likeContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={likePost}>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? 'red' : 'black'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  createPostContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0,
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
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  mediaContainer: {
    padding: 20,
    paddingTop: 10,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalOption: {
    fontSize: 18,
    padding: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F5',
  },
  editModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  textInput: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
});
