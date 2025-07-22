import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const BRAIN_W = width * 0.8;
const BRAIN_H = width * 0.48;
const BUTTON_SIZE = width * 0.18;

const MindMateScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <MaskedView
          style={styles.brainContainer}
          maskElement={
            <Svg width={BRAIN_W} height={BRAIN_H}>
              <Rect
                x="0"
                y="0"
                width={BRAIN_W}
                height={BRAIN_H}
                rx={BRAIN_H / 2}
                ry={BRAIN_H / 2}
                fill="#fff"
              />
            </Svg>
          }
        >
          <Image
            source={require('../assets/brain.png.png')}
            style={styles.brainImage}
            resizeMode="cover"
          />
        </MaskedView>
        <Text style={styles.mindMateText}>To Mind Mate</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subText}>Your personal mental{`\n`}wellness companion</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TrackMoodScreen')}>
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
    backgroundColor: '#53DCCA',
    borderBottomLeftRadius: width * 0.18,
    borderBottomRightRadius: width * 0.18,
    alignItems: 'center',
    height: height * 0.55,
    justifyContent: 'center',
    paddingTop: height * 0.04,
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.06,
  },
  welcomeText: {
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
  brainContainer: {
    width: BRAIN_W,
    height: BRAIN_H,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.012,
    marginTop: height * 0.01,
    overflow: 'hidden',
  },
  brainImage: {
    width: BRAIN_W,
    height: BRAIN_H,
  },
  mindMateText: {
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
  subText: {
    fontSize: 22,
    color: '#222',
    textAlign: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.01,
    maxWidth: width * 0.85,
    lineHeight: width * 0.065,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: '#53DCCA',
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 55,
  },
});

export default MindMateScreen;