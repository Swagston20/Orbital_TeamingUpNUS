import React, {useEffect, useState} from 'react';
import {Text, ImageBackground, View, StyleSheet} from 'react-native';
import {Storage} from 'aws-amplify';

const Card = props => {
  const {name, image, bio, module} = props.user;
  const [imageUrl, setImageUrl] = useState(image);

  useEffect(() => {
    if (!image?.startsWith('http')) {
      Storage.get(image).then(setImageUrl);
    }
  }, [image]);

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: imageUrl,
        }}
        style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
          <Text style={styles.bio}>{module}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#fefefe',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',

    justifyContent: 'flex-end',
  },
  cardInner: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
  },
});

export default Card;
