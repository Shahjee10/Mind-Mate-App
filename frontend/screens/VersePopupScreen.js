import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const quranicVersesByMood = {
  happy: "Indeed, with hardship [will be] ease. — Surah Ash-Sharh [94:6]",
  sad: "So verily, with every difficulty, there is relief. — Surah Ash-Sharh [94:5-6]",
  angry: "And do not let the hatred of a people prevent you from being just. — Surah Al-Ma'idah [5:8]",
  anxious: "Say, 'Never will we be struck except by what Allah has decreed for us.' — Surah At-Tawbah [9:51]",
  neutral: "Indeed, Allah is with the patient. — Surah Al-Baqarah [2:153]",
};

const VersePopupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mood } = route.params || {};
  const verse = quranicVersesByMood[mood] || "Remember Allah is always with you.";

  // Hide the header/navigation bar on this screen
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Optional: auto-close popup after some time (uncomment if needed)
  // useEffect(() => {
  //   const timer = setTimeout(() => navigation.goBack(), 8000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animation/lighthearted.json')}
        autoPlay
        loop={true}
        style={styles.animation}
      />
      <Text style={styles.title}>Quranic Verse for You</Text>
      <Text style={styles.verse}>{verse}</Text>
     <TouchableOpacity
  style={styles.closeBtn}
  onPress={() => navigation.navigate('HomeScreen')}
>
  <Text style={styles.closeBtnText}>Close</Text>
</TouchableOpacity>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E0F8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  animation: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4B0082',
    marginBottom: 15,
    textAlign: 'center',
  },
  verse: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#301934',
    textAlign: 'center',
    marginBottom: 30,
  },
  closeBtn: {
    backgroundColor: '#6C3483',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 6,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default VersePopupScreen;
