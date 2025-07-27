import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import FunkyBackButton from '../components/FunkyBackButton';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 360;

// Mood-to-emoji mapping for dynamic header
const moodEmojis = {
  happy: '😊',
  sad: '😔',
  angry: '😠',
  anxious: '😰',
  neutral: '😐',
};

// Separate component for each message to handle animation
const MessageItem = ({ item }) => {
  const isUser = item.role === 'user';
  const messageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(messageAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        {
          opacity: messageAnim,
          transform: [
            { translateY: messageAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
          ],
        },
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{isUser ? '🙂' : '🤖'}</Text>
      </View>
      <LinearGradient
        colors={isUser ? ['#8e44ad', '#6a0dad'] : ['#ffffff', '#e6e0fa']}
        style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}
      >
        <Text style={isUser ? styles.userText : styles.assistantText}>{item.content}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const SupportScreen = ({ route }) => {
  const { mood } = route.params || {};
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I see you're feeling ${mood || 'this way'}. How can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const sendBtnScale = useRef(new Animated.Value(1)).current;
  const particleAnims = Array(3)
    .fill()
    .map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      ...particleAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 4000 + index * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 4000 + index * 1000,
              useNativeDriver: true,
            }),
          ])
        )
      ),
    ]).start();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://192.168.100.21:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const aiReply =
        data.reply && data.reply.trim() !== ''
          ? data.reply
          : 'Sorry, I couldn’t understand that. Could you please rephrase?';

      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + 'a', role: 'assistant', content: aiReply },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + 'e',
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPress = () => {
    Animated.sequence([
      Animated.timing(sendBtnScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendBtnScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    sendMessage();
  };

  const renderParticle = (anim, index) => {
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -height * 0.3],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.2, 0.5, 0.2],
    });
    return (
      <Animated.View
        key={index}
        style={[
          styles.particle,
          {
            left: index * (width * 0.3) + 50,
            top: height * (0.2 + index * 0.1),
            transform: [{ translateY }],
            opacity,
          },
        ]}
      />
    );
  };

  return (
   <SafeAreaView style={styles.safeArea}>
  <LinearGradient colors={['#4c2882', '#2a1b4d']} style={StyleSheet.absoluteFill} />

  {/* Back button placed absolutely at top-left corner */}
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    activeOpacity={0.7}
    style={styles.backButtonContainer}
    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
  >
    <FunkyBackButton />
  </TouchableOpacity>

  {particleAnims.map(renderParticle)}

  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 30}
  >
   {/* Smaller background container only behind header text */}
        <Animated.View style={[styles.headerContainer, { opacity: headerFadeAnim }]}>
          <Text style={styles.headerTitle}>
            MindMate Helper {moodEmojis[mood] || '🤖'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mood ? `Let's talk about feeling ${mood}` : 'Your AI companion is here!'}
          </Text>
        </Animated.View>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageItem item={item} />}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.chatList}
        />

        {loading && (
          <LinearGradient colors={['#9c27b0', '#6a0dad']} style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingText}>MindMate is thinking...</Text>
          </LinearGradient>
        )}

        <LinearGradient colors={['#9c27b0', '#6a0dad']} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            multiline
            editable={!loading}
            placeholderTextColor="#bbb"
            returnKeyType="send"
            onSubmitEditing={handleSendPress}
          />
          <TouchableOpacity
            onPress={handleSendPress}
            style={[styles.sendBtn, (loading || !input.trim()) && styles.sendBtnDisabled]}
            disabled={loading || !input.trim()}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: sendBtnScale }] }}>
              <Ionicons name="send" size={isSmallScreen ? 22 : 24} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    width: isSmallScreen ? 8 : 10,
    height: isSmallScreen ? 8 : 10,
    borderRadius: 5,
    backgroundColor: '#ffffff33',
  },
  header: {
  paddingHorizontal: 10,
  paddingTop: isSmallScreen ? 10 : 60,
  paddingBottom: 20,
  alignItems: 'center',
  // Remove background color / gradient here (or keep if you want subtle background)
},

 backButtonContainer: {
  position: 'absolute',
  top: 10,
  left: 0,
  padding: 12,  // or less if you want it tighter
  zIndex: 1000,
},

  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#e0c7ff',
    fontStyle: 'italic',
    marginTop: 4,
  },
  chatList: {
    flex: 1,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    maxWidth: '85%',
    alignItems: 'center',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: isSmallScreen ? 30 : 36,
    height: isSmallScreen ? 30 : 36,
    borderRadius: 18,
    backgroundColor: '#ffffff33',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    fontSize: isSmallScreen ? 18 : 20,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#fff',
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '600',
  },
  assistantText: {
    color: '#4a148c',
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '500',
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#9c27b0',
  },
  loadingText: {
    color: '#fff',
    marginLeft: 12,
    fontWeight: '700',
    fontSize: isSmallScreen ? 13 : 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#9c27b0',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffffee',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: isSmallScreen ? 15 : 16,
    color: '#4a148c',
    maxHeight: 100,
    shadowColor: '#9c27b0',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  sendBtn: {
    marginLeft: 12,
    backgroundColor: '#9c27b0',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'center',
    shadowColor: '#7a1fa2',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  sendBtnDisabled: {
    backgroundColor: '#d1a5e0',
    shadowOpacity: 0.3,
  },

   headerContainer: {
    backgroundColor: '#6a0dad', // solid purple background behind text
    alignSelf: 'center',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: isSmallScreen ? 50 : 60,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#2c0657',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});

export default SupportScreen;