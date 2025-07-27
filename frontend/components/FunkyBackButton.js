import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FunkyBackButton = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  return (
    <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
        style={styles.touchArea}
      >
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#171718ff', // Deep purple base
    borderRadius: 35,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',

    // Glow shadow for funkiness
    shadowColor: '#A569BD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 12,
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
});

export default FunkyBackButton;
