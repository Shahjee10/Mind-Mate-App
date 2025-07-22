import React, { useState, useContext, useRef, useEffect } from 'react';
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
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FunkyBackButton from '../components/FunkyBackButton';

// Array of moods with emoji, value, and description for slider
const moods = [
  { label: '😊', value: 'happy', description: 'Feeling joyful and light!' },
  { label: '😔', value: 'sad', description: 'A bit down, that’s okay.' },
  { label: '😠', value: 'angry', description: 'Feeling upset or frustrated.' },
  { label: '😰', value: 'anxious', description: 'Worried or nervous.' },
  { label: '😐', value: 'neutral', description: 'Just feeling okay.' },
];

const MoodInputScreen = () => {
  // State for currently selected mood index in the slider (default neutral)
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(4);
  // State for user’s note about their mood
  const [note, setNote] = useState('');
  // Get auth token from context to authorize API requests
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  // Hide the default top navbar for a cleaner screen
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Animated scale for emoji when mood changes
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Trigger emoji scale animation when selected mood changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedMoodIndex]);

  // Function to submit mood and note to backend
  const handleSubmit = async () => {
    const selectedMood = moods[selectedMoodIndex].value;
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

     alert('Mood saved successfully!');
setNote('');
// Navigate to VersePopupScreen and pass the mood
navigation.navigate('VersePopupScreen', { mood: selectedMood });

    } catch (err) {
      console.error(err);
      alert('Error saving mood: ' + (err.response?.data?.message || err.message));
    }
  };

  // Get current mood object from moods array for display
  const currentMood = moods[selectedMoodIndex];

  return (
    // Adjusts keyboard behavior, especially on iOS
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Custom funky back arrow button */}
        <FunkyBackButton onPress={() => navigation.goBack()} />

        {/* Screen heading */}
        <Text style={styles.heading}>How are you feeling today?</Text>

        {/* Slider container with animated emoji and description */}
        <View style={styles.sliderContainer}>
          <Animated.Text
            style={[styles.emoji, { transform: [{ scale: scaleAnim }] }]}
          >
            {currentMood.label}
          </Animated.Text>

          {/* Mood selection slider */}
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={moods.length - 1}
            step={1}
            value={selectedMoodIndex}
            minimumTrackTintColor="#8e44ad" // deep purple
            maximumTrackTintColor="#c39bd3" // soft lavender
            thumbTintColor="#6c3483" // darker purple
            onValueChange={setSelectedMoodIndex}
          />

          {/* Mood description text */}
          <Text style={styles.moodDescription}>{currentMood.description}</Text>
        </View>

        {/* Prompt for user note */}
        <Text style={styles.prompt}>What made you feel this way?</Text>

        {/* Multiline text input for mood notes */}
        <TextInput
          placeholder="Share your thoughts..."
          placeholderTextColor="#bbb"
          style={styles.input}
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
          textAlignVertical="top"
        />

        {/* Save mood button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Mood</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles for the screen components
const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: '#E6E0F8', // pastel lavender blue background - relaxing
  },
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 40,
    color: '#4B0082', // indigo deep purple
    textShadowColor: 'rgba(155, 89, 182, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#DCC6E0', // soft lilac card background
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#7D3C98',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  emoji: {
    fontSize: 70,
    marginBottom: 12,
    textShadowColor: '#6C3483',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  moodDescription: {
    fontSize: 16,
    color: '#4a4a4a',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
    width: '90%',
  },
  prompt: {
    fontSize: 20,
    marginBottom: 12,
    color: '#301934',
    fontWeight: '600',
    paddingLeft: 4,
  },
  input: {
    backgroundColor: '#F7F1FF', // very light purple
    padding: 20,
    borderRadius: 20,
    marginBottom: 35,
    fontSize: 16,
    color: '#301934',
    shadowColor: '#A569BD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtn: {
    backgroundColor: '#6C3483', // deep purple button
    paddingVertical: 18,
    borderRadius: 25,
    shadowColor: '#512E5F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 1,
  },
});

export default MoodInputScreen;
