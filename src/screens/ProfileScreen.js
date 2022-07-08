import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Auth, DataStore, Storage} from 'aws-amplify';
import {S3Image} from 'aws-amplify-react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {User} from '../models/';
import {request, PERMISSIONS} from 'react-native-permissions';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [module, setModule] = useState();
  const [lookingFor, setLookingFor] = useState();

  const [newImageLocalUri, setNewImageLocalUri] = useState(null);

  useEffect(() => {
    const perm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.CAMERA;
    request(perm).then(status => {
      console.log(status);
    });
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
      );

      if (!dbUsers || dbUsers.length === 0) {
        console.warn('This is a new user');
        return;
      }
      const dbUser = dbUsers[0];
      setUser(dbUser);

      setName(dbUser.name);
      setBio(dbUser.bio);
      setModule(dbUser.module);
      setLookingFor(dbUser.lookingFor);
    };
    getCurrentUser();
  }, []);

  const isValid = () => {
    return name && bio && module && lookingFor;
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(newImageLocalUri);

      const blob = await response.blob();

      const urlParts = newImageLocalUri.split('.');
      const extension = urlParts[urlParts.length - 1];

      const key = `${user.id}.${extension}`;

      await Storage.put(key, blob);

      return key;
    } catch (e) {
      console.log(e);
    }
    return '';
  };

  const save = async () => {
    if (!isValid()) {
      console.warn('Not valid');
      return;
    }
    let newImage;
    if (newImageLocalUri) {
      newImage = await uploadImage();
    }

    if (user) {
      const updatedUser = User.copyOf(user, updated => {
        updated.name = name;
        updated.bio = bio;
        updated.module = module;
        updated.lookingFor = lookingFor;
        if (newImage) {
          updated.image = newImage;
        }
      });

      await DataStore.save(updatedUser);
      setNewImageLocalUri(null);
    } else {
      // create a new user
      const authUser = await Auth.currentAuthenticatedUser();

      const newUser = new User({
        sub: authUser.attributes.sub,
        name,
        bio,
        module,
        lookingFor,
        image:
          'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png',
      });
      await DataStore.save(newUser);
    }

    Alert.alert('User saved successfully');
  };

  const pickImage = () => {
    launchImageLibrary(
      {mediaType: 'mixed'},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (didCancel || errorCode) {
          console.warn('canceled or error');
          console.log(errorMessage);
          return;
        }
        setNewImageLocalUri(assets[0].uri);
      },
    );
  };

  const signOut = async () => {
    await DataStore.clear();
    Auth.signOut();
  };

  const renderImage = () => {
    if (newImageLocalUri) {
      return <Image source={{uri: newImageLocalUri}} style={styles.image} />;
    }
    if (user?.image?.startsWith('http')) {
      return <Image source={{uri: user?.image}} style={styles.image} />;
    }
    return <S3Image imgKey={user?.image} style={styles.image} />;
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
        {renderImage()}

        <Pressable onPress={pickImage}>
          <Text>Change image</Text>
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Name..."
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="bio..."
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />

        <Text>Module*(To show to others you are taking this Mod)</Text>
        <Picker
          label="Module"
          selectedValue={module}
          onValueChange={itemValue => setModule(itemValue)}>
          <Picker.Item label="ES2660" value="ES2660" />
          <Picker.Item label="IS2101" value="IS2101" />
          <Picker.Item label="IS3103" value="IS3103" />
          <Picker.Item label="BT2102" value="BT2102" />
          <Picker.Item label="BT2103" value="BT2103" />
          <Picker.Item label="BT2201" value="BT2201" />
          <Picker.Item label="BT3102" value="BT3102" />
          <Picker.Item label="BT4103" value="BT4103" />
          <Picker.Item label="CS2101" value="CS2101" />
          <Picker.Item label="CS2102" value="CS2102" />
          <Picker.Item label="CS2103" value="CS2103" />
        </Picker>

        <Text>Looking for*(Indicate to find teammate taking this Mod)</Text>
        <Picker
          label="Looking for"
          selectedValue={lookingFor}
          onValueChange={itemValue => setLookingFor(itemValue)}>
          <Picker.Item label="ES2660" value="ES2660" />
          <Picker.Item label="IS2101" value="IS2101" />
          <Picker.Item label="IS3103" value="IS3103" />
          <Picker.Item label="BT2102" value="BT2102" />
          <Picker.Item label="BT2103" value="BT2103" />
          <Picker.Item label="BT2201" value="BT2201" />
          <Picker.Item label="BT3102" value="BT3102" />
          <Picker.Item label="BT4103" value="BT4103" />
          <Picker.Item label="CS2101" value="CS2101" />
          <Picker.Item label="CS2102" value="CS2102" />
          <Picker.Item label="CS2103" value="CS2103" />
        </Picker>

        <Pressable onPress={save} style={styles.button}>
          <Text>Save</Text>
        </Pressable>

        <Pressable onPress={signOut} style={styles.button}>
          <Text>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
  button: {
    backgroundColor: '#ff8c00',
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  input: {
    margin: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  image: {width: 50, height: 50, borderRadius: 50},
});

export default ProfileScreen;