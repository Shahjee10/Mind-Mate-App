import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';  // Import context to get token

const MoodHistoryScreen = ({ navigation }) => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(AuthContext);  // Get JWT token from context

  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!userToken) {
        console.warn('No user token found');
        setLoading(false);
        return;
      }

      try {
        const response =await axios.get('http://192.168.100.21:5000/api/moods/history', {
  headers: { Authorization: `Bearer ${userToken}` },
});


        setMoodHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch mood history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, [userToken]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
      </View>
    );
  }

  if (!moodHistory.length) {
    return (
      <View style={styles.center}>
        <Text>No mood entries yet. Start tracking your mood!</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('MoodDetail', { mood: item })}
    >
      <Text style={styles.moodText}>{item.mood}</Text>
      <View>
        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text numberOfLines={1} style={styles.noteText}>{item.note}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={moodHistory}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  item: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f2e6ff',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  moodText: { fontSize: 30, marginRight: 15 },
  dateText: { fontWeight: '600', marginBottom: 4 },
  noteText: { color: '#555', maxWidth: 250 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default MoodHistoryScreen;
