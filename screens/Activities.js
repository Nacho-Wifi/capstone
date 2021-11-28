import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { doc, addDoc, getDocs, collection, setDoc } from 'firebase/firestore';

const Activities = () => {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const activitiesCollectionRef = collection(db, 'Activities');
  useEffect(() => {
    //every time we make a request return this promise, data to be resolved ...
    const getActivities = async () => {
      const data = await getDocs(activitiesCollectionRef);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
    };
    getActivities();
  }, []);
  const handleNext = () => {
    navigation.navigate('JournalEntry', {
      //pass down selected Activities as props to the moods/journal entry component
      activities: selectedActivities,
    });
  };
  const handleActivitySelect = (activityId) => {
    //we want to make sure we only add the activity once to the journal entry even if user clicks on it a million times
    if (!selectedActivities.includes(activityId)) {
      setSelectedActivities((oldState) => [...oldState, activityId]);
    }
  };

  return (
    <View style={styles.container}>
      <Text> Activities:</Text>
      {activities.map((activity) => {
        return (
          <TouchableOpacity
            key={activity.id}
            style={styles.button}
            onPress={() => {
              handleActivitySelect(activity.id);
            }}
          >
            <Text style={styles.buttonText}>{activity.activityName}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Activities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
