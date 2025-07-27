import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
// import { useLayoutEffect } from 'react'; // No longer needed since we removed headerShown false
import { Ionicons } from '@expo/vector-icons';
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

  /*
  // COMMENTED OUT: Hiding the header removes the default burger menu button.
  // We are adding a custom burger menu button manually inside the screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  */

  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    totalLogged: 0,
    mostCommonMood: null,
    encouragement: '',
  });

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

        const freqMap = {};
        moodsLast7Days.forEach(item => {
          const mood = item.mood?.toLowerCase();
          if (mood) freqMap[mood] = (freqMap[mood] || 0) + 1;
        });

        let mostCommonMood = null;
        let maxCount = 0;
        for (const [mood, count] of Object.entries(freqMap)) {
          if (count > maxCount) {
            maxCount = count;
            mostCommonMood = mood;
          }
        }

        let encouragement = '';
        if (!mostCommonMood) {
          encouragement = 'Start logging your moods to get personalized insights!';
        } else if (mostCommonMood === 'happy' || mostCommonMood === 'excited') {
          encouragement = 'Keep riding this positive wave! 🌟';
        } else if (['sad', 'anxious', 'angry'].includes(mostCommonMood)) {
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
    <View style={{ flex: 1 }}>
      {/* ======= Custom Burger Menu Button at top-left ======= */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.burgerIcon}
        accessibilityLabel="Open drawer menu"
      >
        <Ionicons name="menu" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <LottieView
          source={require('../assets/animation/MeditatingBrain.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        <Text style={styles.greeting}>Welcome back, {userInfo?.name || "Friend"}!</Text>
        <Text style={styles.tagline}>Your mind matters. Let’s take care of it today.</Text>

        {/* ✅ Mood Insights Card with View More */}
        <TouchableOpacity
          style={styles.insightsCard}
          onPress={() => navigation.navigate('MoodAnalytics')}
        >
          {loadingStats ? (
            <ActivityIndicator size="small" color="#6a1b9a" />
          ) : (
            <>
              <Text style={styles.insightsTitle}>Mood Insights (Last 7 days)</Text>
              <Text style={styles.insightsText}>
                Total moods logged:{' '}
                <Text style={styles.insightsHighlight}>{stats.totalLogged}</Text>
              </Text>
              {stats.mostCommonMood ? (
                <Text style={styles.insightsText}>
                  Most common mood:{' '}
                  <Text style={styles.insightsHighlight}>
                    {moodConfig[stats.mostCommonMood]?.emoji}{' '}
                    {moodConfig[stats.mostCommonMood]?.label || stats.mostCommonMood}
                  </Text>
                </Text>
              ) : null}
              <Text style={[styles.insightsText, styles.encouragement]}>
                {stats.encouragement}
              </Text>

              {/* ➕ View More hint */}
              <Text style={styles.viewMore}>View Mood Chart →</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MoodInputScreen')}
        >
          <Text style={styles.buttonText}>➕ Log Mood</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('SupportScreen')}  // ✅ Navigates to chatbot
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
    </View>
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
    backgroundColor: '#e6d4f3',
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
  burgerIcon: {
    position: 'absolute',
    top: 50, // adjust to avoid status bar overlap
    left: 15,
    zIndex: 1000,
    backgroundColor:'#7dbeffff', // optional white background for visibility
    padding: 5,
    borderRadius: 5,
    elevation: 5, // shadow on Android
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
    backgroundColor: '#02a796ff',
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
  viewMore: {
    marginTop: 10,
    fontSize: 14,
    color: '#4b0082',
    textAlign: 'right',
    fontWeight: '600',
    right: 95,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
