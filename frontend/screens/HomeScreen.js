import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  const quranicVerse = "Indeed, with hardship [will be] ease. — Surah Ash-Sharh [94:6]";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LottieView
        source={require('../assets/animation/MeditatingBrain.json')} // 👈 animation file
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={styles.greeting}>Welcome back, {userInfo?.name || "Friend"}!</Text>
      <Text style={styles.tagline}>Your mind matters. Let’s take care of it today.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MoodInputScreen')} // Navigate to MoodInputScreen
      >
        <Text style={styles.buttonText}>➕ Log Mood</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => {
          // Future: navigate to AI chat screen
        }}
      >
        <Text style={styles.buttonText}>🧠 Talk to MindMate</Text>
      </TouchableOpacity>

      {/* New button for Mood History */}
      <TouchableOpacity
        style={styles.buttonHistory}
        onPress={() => navigation.navigate('MoodHistoryScreen')} // Navigate to MoodHistoryScreen
      >
        <Text style={styles.buttonText}>📅 View Mood History</Text>
      </TouchableOpacity>

      <View style={styles.verseContainer}>
        <Text style={styles.verseTitle}>📖 Quranic Verse of the Day</Text>
        <Text style={styles.verse}>{quranicVerse}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
  },
  animation: {
    width: width * 0.8,
    height: 250,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  tagline: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#7986cb',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonHistory: {
    backgroundColor: '#6a1b9a', // a nice purple color for variety
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  verseContainer: {
    backgroundColor: '#fff',
    marginTop: 30,
    borderRadius: 10,
    padding: 20,
    width: '85%',
    elevation: 3,
  },
  verseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  verse: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
