import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {DataStore, Auth} from 'aws-amplify';
import {User, Match} from '../models';

import Card from '../components/TinderCard';

import AnimatedStack from '../components/AnimatedStack';

const HomeScreen = ({isUserLoading}) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [me, setMe] = useState(null);
  const [matchesIds, setMatchesIds] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await Auth.currentAuthenticatedUser();

      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', user.attributes.sub),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setMe(dbUsers[0]);
    };
    getCurrentUser();
  }, [isUserLoading]);

  useEffect(() => {
    if (!me) {
      return;
    }
    const fetchMatches = async () => {
      const result = await DataStore.query(Match, m =>
        m
          .isMatch('eq', true)
          .or(m1 => m1.User1ID('eq', me.id).User2ID('eq', me.id)),
      );
      setMatchesIds(
        result.map(match =>
          match.User1ID === me.id ? match.User2ID : match.User1ID,
        ),
      );
    };
    fetchMatches();
  }, [me]);

  useEffect(() => {
    if (isUserLoading || !me || matchesIds === null) {
      return;
    }
    const fetchUsers = async () => {
      let fetchedUsers = await DataStore.query(User, user =>
        user.module('eq', me.lookingFor),
      );

      fetchedUsers = fetchedUsers.filter(u => !matchesIds.includes(u.id));

      setUsers(fetchedUsers);
    };
    fetchUsers();
  }, [isUserLoading, me, matchesIds]);

  const onSwipeLeft = () => {
    if (!currentUser || !me) {
      return;
    }

    console.warn('swipe left', currentUser.name);
  };

  const onSwipeRight = async () => {
    if (!currentUser || !me) {
      return;
    }


    console.warn('Sending him a match request!');
    const newMatch = new Match({
      User1ID: me.id,
      User2ID: currentUser.id,
      isMatch: false,
    });
    console.log(newMatch);
    DataStore.save(newMatch);
  };

  console.log(users);

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem={({item}) => <Card user={item} />}
        setCurrentUser={setCurrentUser}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
      <View style={styles.icons}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
});

export default HomeScreen;
