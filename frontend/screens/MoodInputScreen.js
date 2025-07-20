import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const moods = [
  { label: '😊', value: 'happy', description: 'Feeling joyful and light!' },
  { label: '😔', value: 'sad', description: 'A bit down, that’s okay.' },
  { label: '😠', value: 'angry', description: 'Feeling upset or frustrated.' },
  { label: '😰', value: 'anxious', description: 'Worried or nervous.' },
  { label: '😐', value: 'neutral', description: 'Just feeling okay.' },
];

const MoodInputScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const { userToken } = useContext(AuthContext);

  // For animation scale effect on mood buttons
  const scaleAnim = useRef(moods.map(() => new Animated.Value(1))).current;

  const animateMood = (index) => {
    Animated.sequence([
      Animated.timing(scaleAnim[index], {
        toValue: 1.2,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim[index], {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleMoodPress = (mood, index) => {
    setSelectedMood(mood);
    animateMood(index);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return alert('Please select a mood.');

    try {
      await axios.post(
        'http://192.168.100.21:5000/api/moods/add',
        {
          mood: selectedMood,
          note,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      // Show success message and optionally clear state or navigate
      alert('Mood saved successfully!');
      setSelectedMood(null);
      setNote('');
      // Navigate to SupportScreen and pass the selected mood
      navigation.navigate('SupportScreen', { mood: selectedMood });
    } catch (err) {
      console.error(err);
      alert('Error saving mood: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f7ff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>How are you feeling today?</Text>

        <View style={styles.moodContainer}>
          {moods.map((mood, i) => (
            <TouchableOpacity
              key={mood.value}
              activeOpacity={0.8}
              onPress={() => handleMoodPress(mood.value, i)}
              style={styles.moodWrapper}
            >
              <Animated.View
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.selected,
                  { transform: [{ scale: scaleAnim[i] }] },
                ]}
              >
                <Text style={styles.moodText}>{mood.label}</Text>
              </Animated.View>
              {selectedMood === mood.value && (
                <Text style={styles.moodDescription}>{mood.description}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.prompt}>What made you feel this way?</Text>
        <TextInput
          placeholder="Share your thoughts..."
          style={styles.input}
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveBtnText}>Save Mood</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#10375c',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  moodWrapper: {
    alignItems: 'center',
    width: 60,
  },
  moodButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#d0e6ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  selected: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4caf5080',
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  moodText: {
    fontSize: 32,
  },
  moodDescription: {
    marginTop: 6,
    fontSize: 12,
    color: '#4a4a4a',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  prompt: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1a1a1a',
    fontWeight: '600',
    paddingLeft: 4,
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 25,
    fontSize: 16,
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  saveBtn: {
    backgroundColor: '#1a73e8',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#1a73e880',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default MoodInputScreen;
