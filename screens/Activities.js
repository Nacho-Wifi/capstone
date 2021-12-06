import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { doc, addDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { color } from 'react-native-reanimated';

const Activities = ({ route }) => {
  const emojiMapping = {
    "U+1F6C0": "🛀",
    "U+1F3A8": "🎨",
    "U+1F4D6": "📖",
    "U+1F9D8": "🧘",
    "U+1F6B6": "🚶",
    "U+1F3A7": "🎧",
    "U+1F372": "🍲",
    "U+1F465": "👥",
    "U+1F6B2": "🚲",
  }
  const navigation = useNavigation();
  const journalData = route.params;
  // State
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const activitiesCollectionRef = collection(db, 'Activities');
  // console.log('SELECTED ACTIVITIES: ', selectedActivities)
  // console.log('ACTIVITIES PASSED DOWN AS PROPS: ', journalData.journalEntries.activities)

  // Gets all activities data
  useEffect(() => {

    //every time we make a request return this promise, data to be resolved ...
    const getActivities = async () => {
      const data = await getDocs(activitiesCollectionRef);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
      // if this is true, craete activities id state then check if the id == activity.id?
      // would only work if user has an entry already
      if (journalData) setSelectedActivities(journalData.journalEntries.activities);
      setIsLoading(false);
    };
    getActivities();
  }, []);

  // const isActivitySelected = (activity) => {
  //   // check if selectedActivities (which will be populated with already existing entires passed down as props)
  //   // contains the current activity we're looping over - cannot use includes because the array may contain a copy of the object
  //   selectedActivities.some(element => {
  //     element.id === activity.id
  //   })
  // }

  const handleNext = () => {
    // activities are being added onto state array here - if we want to remove one we need to remove it from state
    navigation.navigate('JournalEntry', {
      //pass down selected Activities as props to the moods/journal entry component
      activities: selectedActivities,
      journalData,
    });
  };
  const handleActivitySelect = (activity) => {
    //we want to make sure we only add the activity once to the journal entry even if user clicks on it a million times
    if (!selectedActivities.includes(activity)) {
      setSelectedActivities((oldState) => [...oldState, activity]);
    } else {
      // If user selects the activity again, it will remove it from the selectedActivities state array
      setSelectedActivities(selectedActivities.filter(current => activity.id !== current.id))
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (

    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {/* <Text style={{ justifyContent: 'center' }}> Activities:</Text> */}
        {activities.map((activity) => {
          // console.log('ACTIVITIES IN SELECTED ACTIVITIES: ', selectedActivities)
          // console.log('MAPPED ACTIVITIES', activity)
          // console.log('selected activites contain activity? ', selectedActivities.find(el => el.id === activity.id))
          return (
            <TouchableOpacity
              key={activity.id}

              // Check if activity is in selectedActivities array - if it is make it darker
              style={selectedActivities.some(element => element.id === activity.id) ? [styles.selectedButton, styles.selectedButtonText] : styles.button}
              onPress={() => {
                handleActivitySelect(activity);
              }}
            ><Text style={styles.buttonText}> {emojiMapping[activity.emojiUnicode]}</Text>
              <Text style={styles.buttonText}>{activity.activityName} </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView >
  );
};

export default Activities;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#BDD8F1',
    width: '60%',
    padding: 15,
    margin: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center'
  },
  selectedButton: {
    backgroundColor: '#7bb6ed', // Temporary!
    width: '60%',
    margin: 16,
    padding: 15,
    alignItems: 'center',
    // borderColor: '#BDD8F1',
    // borderWidth: 2,
    borderRadius: 10,
  },
});
