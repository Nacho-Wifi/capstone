import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

//import MyData2 from './MyData2'

import LoadingIcon from './components/LoadingIcon';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native';
import {
  doc,
  addDoc,
  getDocs,
  setDoc,
  collection,
  where,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryArea,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory-native';
import LottieView from 'lottie-react-native';


const { width, height } = Dimensions.get('screen');

const MoodActivity2 = ({entries, mappedEntries, dateDescription, day}) => {


  //const navigation = useNavigation();

  //const [moods, setMoods] = useState([]);

  const [entriesLength, setEntriesLength] = useState(0)
  const [loading, setLoading] = useState(true)



  //console.log('entries', entries)

  useEffect(() => {

    //setLoading(true);
    setEntriesLength(entries.length)
    setLoading(false)

    console.log('entries inside moodactivity', entries.length)
  }, [entries.length])


  console.log('entries.length outside useEffect', entries.length)
  console.log('entriesLength outside useEffect', entriesLength)



  //console.log('dateDescription:', dateDescription);

  // if(!entriesLength ) return <LoadingIcon/>

  return (

    entriesLength <= 1 ?
    <View style={styles.container}>
      <LottieView
        style={styles.lottieHistogram}
        source={require('../assets/lottie/histogram.json')}
        autoPlay
      />
      <Text style={styles.textStyling}>Your mood chart will appear here after two days of journaling!</Text>
    </View>
   :
    <View style={styles.container}>
      <VictoryChart
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryVoronoiContainer
            dimension="x"
            labels={({ datum }) => datum.activities[0].image}
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: 30 }}
                // cornerRadius={16}
                pointerLength={0}
                constrainToVisibleArea
                flyoutStyle={{
                  fill: 'none',
                  stroke: 'none',
                }}
              />
            }
          />
        }
        scale={{ x: 'time' }}
        minDomain={{ x: day }}
        maxDomain={{ y: 5.2 }}
        height={400}
      >
        <VictoryAxis
          tickFormat={(date) =>
            date.toLocaleString('en-us', { day: 'numeric' }) +
            '\n' +
            date.toLocaleString('en-us', dateDescription)
          }
          fixLabelOverlap={true}
        />
        <VictoryAxis
          dependentAxis
          domain={[0, 5]}
          tickValues={['😢', '😔', '😐', '😌', '😁']}
          tickFormat={(t) => t}
        />

        <VictoryArea
          style={{ data: { fill: '#6590c7', stroke: 'pink', strokeWidth: 2 } }}
          data={mappedEntries}
          x="date"
          y="scale"
          animate
          interpolation="catmullRom"
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>


    </View>
  );
};
export default MoodActivity2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40
  },
  textStyling: {
    display: 'flex',
    color: '#b5179e',
    alignContent: 'center',
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: 16,
  },
  lottieHistogram: {
    width: 150,
    height: 150,
  },

});
