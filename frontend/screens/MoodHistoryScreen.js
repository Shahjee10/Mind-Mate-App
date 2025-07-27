import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FunkyBackButton from '../components/FunkyBackButton'; // Make sure path is correct

const moodConfig = {
  Happy:   { emoji: '😄', color: '#FFE082' },
  Sad:     { emoji: '😢', color: '#E1BEE7' },
  Angry:   { emoji: '😠', color: '#EF5350' },  // Slightly stronger red
  Excited: { emoji: '🤩', color: '#B2DFDB' },
  Neutral: { emoji: '😐', color: '#CFD8DC' },
};

const MoodHistoryScreen = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!userToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://192.168.100.21:5000/api/moods/history', {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        // Group moods by date string
        const grouped = response.data.reduce((acc, item) => {
          const date = new Date(item.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
          });
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc;
        }, {});

        const sections = Object.entries(grouped).map(([date, data]) => ({
          title: date,
          data,
        }));

        setMoodHistory(sections);
      } catch (error) {
        console.error('Failed to fetch mood history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, [userToken]);

  useEffect(() => {
    // Hide the header/navbar
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!moodHistory.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>😔 No mood entries yet. Start tracking your mood!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* FunkyBackButton replacing default back */}
      <View style={styles.backButton}>
        <FunkyBackButton onPress={() => navigation.goBack()} />
      </View>

      {/* Top Mood Image */}
      <Image
        source={require('../assets/mood.webp')}
        style={styles.headerImage}
        resizeMode="contain"
      />

      {/* Mood History SectionList */}
      <SectionList
        sections={moodHistory}
        keyExtractor={(item, index) => item._id + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => {
          const normalizedMood = item.mood?.trim().toLowerCase();

          // Defensive: find key matching normalizedMood (case insensitive)
          const matchedKey = Object.keys(moodConfig).find(
            key => key.toLowerCase() === normalizedMood
          );

          // Use found config or fallback
          const config = matchedKey ? moodConfig[matchedKey] : { emoji: '😶', color: '#E0E0E0' };

          const time = new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <View style={[styles.card, { backgroundColor: config.color + 'D0' }]}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.note} numberOfLines={3} ellipsizeMode="tail">
                  {item.note || 'No notes added'}
                </Text>
                <Text style={styles.time}>
                  <Text>Time: </Text>
                  <Text>{time}</Text>
                </Text>
              </View>
              <Text style={styles.moodEmoji}>{config.emoji}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor: '#f0f4f8',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  backButton: {
    position: 'absolute',
    top: 1,
    left: 10,
    zIndex: 10,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 100,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  note: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  time: {
    color: '#333',
    fontSize: 13,
  },
  moodEmoji: {
    fontSize: 36,
  },
  center: {
    flex: 1,
    backgroundColor: '#D8B4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#000',
    fontSize: 16,
  },
});

export default MoodHistoryScreen;
