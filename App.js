import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MusicAnimation from './src/App';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MusicAnimation/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: '100%',
    backgroundColor: 'rgb(30, 32, 32)',
  },
});
