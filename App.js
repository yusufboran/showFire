import React, { useState, useEffect } from 'react';
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { StyleSheet, Text, View,  Platform } from 'react-native';
import axios from 'axios';
import { BallIndicator, UIActivityIndicator } from 'react-native-indicators';

export default function App() {

  const [item, setItem] = useState({
    event: [],
    loading: true
  });
  const fireMap = () => {
    axios.get('https://eonet.gsfc.nasa.gov/api/v3/events')
      .then((res) => {
        setItem({
          event: res.data.events,
          loading: false
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }
  useEffect(() => {
    fireMap();
  });
  return (
    <View style={styles.container}>
      {item.loading
        ? (
          Platform.OS === "android"
            ? <BallIndicator />
            : <UIActivityIndicator />
        )
        : <MapView style={styles.map}
          initialRegion={{
            latitude:41.014578,
            longitude: 28.979540,
            latitudeDelta: 8.5,
            longitudeDelta: 8.5,
          }}
        >

          {item.event.map(
            item => {
              if (typeof item["geometry"][0]["coordinates"][1] != "object") {
                return <Marker coordinate={{
                  latitude: item["geometry"][0]["coordinates"][1],
                  longitude: item["geometry"][0]["coordinates"][0]
                }}
                  title={item.title}
                  description={item.link}
                  key={item["id"]}
                >

                  <Text style={{fontSize:30}}>🔥</Text>
                </Marker>
              }

            }
          )}

        </MapView>

      }
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: "100%",
    height: "100%",
  },
});