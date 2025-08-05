import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // For whole container fade
  const fadeAnimButton = useRef(new Animated.Value(0)).current; // For button fade
  const animationRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const onAnimationFinish = () => {
    setShowButton(true);
    // Start button fade-in animation
    Animated.timing(fadeAnimButton, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={['#A18CD1', '#FBC2EB']} style={styles.container}>
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
        <LottieView
          ref={animationRef}
          source={require('../assets/animation/mindmate-animation.json')}
          autoPlay
          loop={false}
          onAnimationFinish={onAnimationFinish}
          style={styles.lottie}
        />
        <Text style={styles.title}>Mind Mate</Text>
        <Text style={styles.tagline}>Empowering your mental wellness every day</Text>

        {showButton && (
          <Animated.View style={{ opacity: fadeAnimButton }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('MindMateScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Explore</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    letterSpacing: 1.2,
  },
  tagline: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#6a4bcf',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
