import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HEADER_COLOR = '#E9AFFF'; // Lighter purple
const BUTTON_SIZE = width * 0.18;

const MOOD_IMG_W = width * 0.45;
const MOOD_IMG_H = width * 0.45;

const TrackMoodScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track</Text>
        <View style={styles.moodImgContainer}>
          <Image
            source={require('../assets/trackmood.png')}
            style={styles.moodImg}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.subtitle}>Mood</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.desc}>
          “Track how you feel daily”{"\n"}“Your mood insights{"\n"}visualized beautifully”
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TalkToMindMateScreen')}>
          <Svg width={BUTTON_SIZE * 0.6} height={BUTTON_SIZE * 0.6} viewBox="0 0 48 48" fill="none">
            <Path
              d="M10 24h28M28 14l10 10-10 10"
              stroke="#000"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8ECEF',
  },
  header: {
    backgroundColor: HEADER_COLOR,
    borderBottomLeftRadius: width * 0.15,
    borderBottomRightRadius: width * 0.15,
    alignItems: 'center',
    height: height * 0.55,
    justifyContent: 'center',
    paddingTop: height * 0.04,
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.06,
  },
  title: {
    fontSize: width * 0.12,
    color: '#000',
    fontFamily: 'DancingScript',
    fontStyle: 'italic',
    letterSpacing: 2.2,
    marginBottom: height * 0.012,
    marginTop: height * 0.01,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  moodImgContainer: {
    width: MOOD_IMG_W,
    height: MOOD_IMG_H,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.012,
    marginTop: height * 0.01,
    overflow: 'hidden',
  },
  moodImg: {
    width: MOOD_IMG_W,
    height: MOOD_IMG_H,
  },
  subtitle: {
    fontSize: width * 0.12,
    color: '#000',
    fontFamily: 'DancingScript',
    fontStyle: 'italic',
    letterSpacing: 2.2,
    marginBottom: height * 0.01,
    marginTop: height * 0.04,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  content: {
    flex: 1,
    backgroundColor: '#E8ECEF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.04,
    paddingHorizontal: width * 0.08,
  },
  desc: {
    fontSize: 22,
    color: '#222',
    textAlign: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.01,
    maxWidth: width * 0.9,
    lineHeight: 28,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: HEADER_COLOR,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default TrackMoodScreen; 