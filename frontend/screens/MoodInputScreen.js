import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import FunkyBackButton from '../components/FunkyBackButton';
import API_BASE_URL from '../apiConfig';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 360;

const moods = [
  { label: '😊', value: 'happy', description: 'Feeling joyful and light!' },
  { label: '😔', value: 'sad', description: 'A bit down, that’s okay.' },
  { label: '😠', value: 'angry', description: 'Feeling upset or frustrated.' },
  { label: '😰', value: 'anxious', description: 'Worried or nervous.' },
  { label: '😐', value: 'neutral', description: 'Just feeling okay.' },
];

const MoodInputScreen = () => {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(4);
  const [note, setNote] = useState('');
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

  const handleSubmit = async () => {
    const selectedMood = moods[selectedMoodIndex].value;
    if (!selectedMood) return alert('Please select a mood.');

    try {
     await axios.post(
  `${API_BASE_URL}/api/moods/add`,
  { mood: selectedMood, note },
  { headers: { Authorization: `Bearer ${userToken}` } }
);
      alert('Mood saved successfully!');
      setNote('');
      navigation.navigate('VersePopupScreen', { mood: selectedMood });
    } catch (err) {
      console.error(err);
      alert('Error saving mood: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleBackPress = useCallback(() => {
    console.log('Back button pressed, navigating back. Navigation state:', navigation.getState());
    try {
      navigation.goBack();
    } catch (error) {
      console.error('Navigation goBack failed:', error);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        })
      );
    }
  }, [navigation]);

  const currentMood = moods[selectedMoodIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
  <FunkyBackButton onPress={handleBackPress} />
</View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <Text style={styles.heading}>How are you feeling today?</Text>
            <View style={styles.sliderContainer}>
              <Animated.Text style={[styles.emoji, { transform: [{ scale: scaleAnim }] }]}>
                {currentMood.label}
              </Animated.Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={moods.length - 1}
                step={1}
                value={selectedMoodIndex}
                minimumTrackTintColor="#8e44ad"
                maximumTrackTintColor="#c39bd3"
                thumbTintColor="#6c3483"
                onValueChange={setSelectedMoodIndex}
              />
              <Text style={styles.moodDescription}>{currentMood.description}</Text>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollBox}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.scrollContainer}
            >
              <Text style={styles.prompt}>What made you feel this way?</Text>
              <TextInput
                placeholder="Share your thoughts..."
                placeholderTextColor="white"
                style={styles.input}
                multiline
                numberOfLines={6}
                value={note}
                onChangeText={setNote}
                textAlignVertical="top"
                backgroundColor="#77027dff"
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Save Mood</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  keyboardView: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.select({ ios: 10, android: 15 }),
    left: 20,
    zIndex: 999,
  },
  backButton: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.select({ ios: 120, android: 110 }),
    paddingHorizontal: isSmallScreen ? 16 : 24,
    width: '100%',
  },
  heading: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 30 : 40,
    color: '#4B0082',
    textShadowColor: 'rgba(155, 89, 182, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#DCC6E0',
    borderRadius: 30,
    paddingVertical: 25,
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
  slider: {
    width: '100%',
    height: 40,
  },
  moodDescription: {
    fontSize: 16,
    color: '#4a4a4a',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
    width: '90%',
  },
  scrollContainer: {
    flexGrow: 0,
    maxHeight: height * 0.5,
    width: '100%',
  },
  scrollBox: {
    paddingBottom: 40,
  },
  prompt: {
    fontSize: 20,
    marginBottom: 12,
    color: '#301934',
    fontWeight: '600',
    paddingLeft: 4,
  },
  input: {
    backgroundColor: '#F7F1FF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    fontSize: 16,
    color: '#301934',
    shadowColor: '#A569BD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 140,
    width: '100%',
  },
  saveBtn: {
    backgroundColor: '#6C3483',
    paddingVertical: 22,
    borderRadius: 25,
    shadowColor: '#512E5F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 1,
  },
});

export default MoodInputScreen;