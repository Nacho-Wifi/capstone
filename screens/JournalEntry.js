import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  collection,
  setDoc,
} from 'firebase/firestore';

const JournalEntry = ({ route }) => {
  const emojiMapping = {
    'U+1F622': '😢',
    'U+1F614': '😔',
    'U+1F610': '😐',
    'U+1F60C': '😌',
    'U+1F601': '😁',
  };
  const navigation = useNavigation();
  //this route.params gives us access to the props passed down by our Activities component using react navigation
  const { activities, journalId } = route.params;
  const [moods, setMoods] = useState([]);
  const moodsCollectionRef = collection(db, 'Moods');
  const journalsCollectionRef = collection(db, 'Journals');
  useEffect(() => {
    //every time we make a request return this promise, data to be resolved ...
    const getMoods = async () => {
      const data = await getDocs(moodsCollectionRef);
      setMoods(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
    };
    getMoods();
  }, []);

  const setJournal = async (mood) => {
    // Find doc by journalId
    // console.log("JOURNALID: ", journalId)
    // If journalId is undefined, create a new journal entry
    // console.log(journalId === undefined)
    if (!journalId) {
      await addDoc(journalsCollectionRef, {
        mood,
        activities,
        createdAt: new Date().toDateString(),
        userId: auth.currentUser.email,
      });
      // Otherwise, update the exisiting journal entry
    } else {
      console.log('JOURNAL ALREADY EXISTS, JOURNALID: ', journalId.journalId)
      await setDoc(doc(db, "Journals", journalId.journalId), {
        mood,
        activities,
        createdAt: new Date().toDateString(),
        userId: auth.currentUser.email,
      });
    }


    // const docRef = doc(db, "Journals", journalId.journalId);
    // const docSnap = await getDoc(docRef);

    // console.log(docSnap.exists())
    // if (docSnap.exists()) {
    //   // If doc exists, update doc
    //   const updatedDoc = await setDoc(doc(db, "Journals", journalId.journalId), {
    //     mood,
    //     activities,
    //     createdAt: new Date().toDateString(),
    //     userId: auth.currentUser.email,
    //   });
    //   // console.log(updatedDoc)
    //   // console.log("Document data:", docSnap.data());
    //   // Otherwise, create new doc
    // } else {
    //   await addDoc(journalsCollectionRef, {
    //     mood,
    //     activities,
    //     createdAt: new Date().toDateString(),
    //     userId: auth.currentUser.email,
    //   });
    //   // }
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text> Mood:</Text>
      {moods.map((mood) => {
        return (
          <TouchableOpacity
            key={mood.id}
            style={styles.button}
            onPress={() => {
              setJournal(mood);
            }}
          >
            <Text>{emojiMapping[mood.imageUrl]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default JournalEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BDD8F1',
    width: '24%',
    padding: 15,
    borderRadius: 10,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // buttonText: {
  //   color: 'white',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
});
