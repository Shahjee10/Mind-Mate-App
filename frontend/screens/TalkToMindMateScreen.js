import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HEADER_COLOR = '#7F9FDF';
const BUTTON_SIZE = width * 0.18;
const OVAL_W = width * 0.55;
const OVAL_H = width * 0.38;

const TalkToMindMateScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Talk To</Text>
        <View style={styles.ovalContainer}>
          <Svg width={OVAL_W} height={OVAL_H} style={StyleSheet.absoluteFill}>
            <Rect
              x="0"
              y="0"
              width={OVAL_W}
              height={OVAL_H}
              rx={OVAL_H / 2}
              ry={OVAL_H / 2}
              fill="#fff"
            />
          </Svg>
          <Image
            source={require('../assets/talk.png')}
            style={styles.ovalImg}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.subtitle}>Mind Mate</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.desc}>
          {`“Talk to your AI buddy”\n“Get support, verses and gentle suggestions”`}
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.buttonText}>Get Started !</Text>
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
  ovalContainer: {
    width: OVAL_W,
    height: OVAL_H,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.012,
    marginTop: height * 0.01,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  ovalImg: {
    width: OVAL_W * 0.8,
    height: OVAL_H * 0.8,
    position: 'absolute',
    left: OVAL_W * 0.1,
    top: OVAL_H * 0.1,
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
    width: width * 0.7,
    height: 55,
    backgroundColor: HEADER_COLOR,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 26,
  },
});

export default TalkToMindMateScreen; 