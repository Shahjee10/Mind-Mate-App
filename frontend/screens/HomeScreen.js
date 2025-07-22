import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const moodConfig = {
  happy:   { emoji: '😊', label: 'Happy' },
  sad:     { emoji: '😔', label: 'Sad' },
  angry:   { emoji: '😠', label: 'Angry' },
  anxious: { emoji: '😰', label: 'Anxious' },
  neutral: { emoji: '😐', label: 'Neutral' },
};

const HomeScreen = () => {
  const { userInfo, userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  // Mood stats state
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    totalLogged: 0,
    mostCommonMood: null,
    encouragement: '',
  });

  // Fetch mood history last 7 days for insights
  useEffect(() => {
    const fetchMoodStats = async () => {
      if (!userToken) {
        setLoadingStats(false);
        return;
      }

      try {
        const response = await axios.get('http://192.168.100.21:5000/api/moods/history', {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        const moodsLast7Days = response.data.filter(item => {
          const created = new Date(item.createdAt);
          const now = new Date();
          const diffDays = (now - created) / (1000 * 3600 * 24);
          return diffDays <= 7;
        });

        const totalLogged = moodsLast7Days.length;

        // Count moods frequency
        const freqMap = {};
        moodsLast7Days.forEach(item => {
          const mood = item.mood?.toLowerCase();
          if (mood) freqMap[mood] = (freqMap[mood] || 0) + 1;
        });

        // Find most common mood
        let mostCommonMood = null;
        let maxCount = 0;
        for (const [mood, count] of Object.entries(freqMap)) {
          if (count > maxCount) {
            maxCount = count;
            mostCommonMood = mood;
          }
        }

        // Prepare encouragement based on most common mood
        let encouragement = '';
        if (!mostCommonMood) {
          encouragement = 'Start logging your moods to get personalized insights!';
        } else if (mostCommonMood === 'happy' || mostCommonMood === 'excited') {
          encouragement = 'Keep riding this positive wave! 🌟';
        } else if (mostCommonMood === 'sad' || mostCommonMood === 'anxious' || mostCommonMood === 'angry') {
          encouragement = 'Remember, it’s okay to have tough days. You’re doing great by tracking your feelings!';
        } else {
          encouragement = 'Keep checking in with yourself daily.';
        }

        setStats({ totalLogged, mostCommonMood, encouragement });
      } catch (error) {
        console.error('Failed to fetch mood stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchMoodStats();
  }, [userToken]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LottieView
        source={require('../assets/animation/MeditatingBrain.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={styles.greeting}>Welcome back, {userInfo?.name || "Friend"}!</Text>
      <Text style={styles.tagline}>Your mind matters. Let’s take care of it today.</Text>

      {/* Mood Insights Card */}
      <View style={styles.insightsCard}>
        {loadingStats ? (
          <ActivityIndicator size="small" color="#6a1b9a" />
        ) : (
          <>
            <Text style={styles.insightsTitle}>Mood Insights (Last 7 days)</Text>
            <Text style={styles.insightsText}>
              Total moods logged: <Text style={styles.insightsHighlight}>{stats.totalLogged}</Text>
            </Text>
            {stats.mostCommonMood ? (
              <Text style={styles.insightsText}>
                Most common mood: <Text style={styles.insightsHighlight}>
                  {moodConfig[stats.mostCommonMood]?.emoji} {moodConfig[stats.mostCommonMood]?.label || stats.mostCommonMood}
                </Text>
              </Text>
            ) : null}
            <Text style={[styles.insightsText, styles.encouragement]}>{stats.encouragement}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MoodInputScreen')}
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

      <TouchableOpacity
        style={styles.buttonHistory}
        onPress={() => navigation.navigate('MoodHistoryScreen')}
      >
        <Text style={styles.buttonText}>📅 View Mood History</Text>
      </TouchableOpacity>

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
  insightsCard: {
    backgroundColor: '#e6d4f3', // Soft lavender for calm vibes
    borderRadius: 14,
    padding: 20,
    width: '85%',
    marginVertical: 25,
    shadowColor: '#7d4ba6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4b0082',
    marginBottom: 12,
    textAlign: 'center',
  },
  insightsText: {
    fontSize: 15,
    color: '#4a4a4a',
    marginBottom: 6,
    textAlign: 'center',
  },
  insightsHighlight: {
    fontWeight: '700',
    color: '#6a1b9a',
  },
  encouragement: {
    marginTop: 8,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#522e69',
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
    backgroundColor: '#6a1b9a',
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
});

export default HomeScreen;
