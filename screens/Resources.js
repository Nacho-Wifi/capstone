import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let coordinates = await Location.getCurrentPositionAsync({});
      setLocation(coordinates);

      setMapRegion({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0922,
      });
    })();
    setLoading(false);
  }, []);

  let text = 'Waiting..';
  if (loading) {
    return <View>Loading ...</View>;
  } else {
    if (errorMsg) {
      console.log('IS THERE AN ERROR', errorMsg);
      text = errorMsg;
      return (
        <View style={styles.container}>
          <Text>Resources With an Error Flair</Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={mapRegion}
          />
        </View>
      );
    } else if (location) {
      console.log('ARE WE HITTING LOCATION?', location);
      text = JSON.stringify(location);
      return (
        <View style={styles.container}>
          <Text>Resources Near You</Text>
          <script
            async
            src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap"
          ></script>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Unpersonalized resources</Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={{
              latitude: 47,
              longitude: 74,
              longitudeDelta: 0.0922,
              latitudeDelta: 0.0421,
            }}
          />
        </View>
      );
    }
  }
};
export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '90%',
    height: 300,
  },
});
