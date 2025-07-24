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

const { width, height } = Dimensions.get('window');

const SupportScreen = ({ route }) => {
  const { mood } = route.params || {};
  const { userToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I see you are feeling ${mood || 'this way'}. How can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  // Auto scroll on new message
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Animated floating circles for vibe
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 7000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 7000, useNativeDriver: true }),
      ]),
    ).start();
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
    console.log('AI reply from backend:', data.reply);

    const aiReply =
      data.reply && data.reply.trim() !== ''
        ? data.reply
        : 'Sorry, I couldn’t understand that. Could you please rephrase?';

    setMessages(prev => [
      ...prev,
      { id: Date.now().toString() + 'a', role: 'assistant', content: aiReply },
    ]);
  } catch (error) {
    console.error('AI chat error:', error.message);
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


  const renderItem = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={isUser ? styles.userText : styles.assistantText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  // Animated floating bubbles positions and styles
  const bubbleTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });
  const bubbleOpacity = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Animated floating bubbles */}
      <Animated.View
        style={[styles.floatingBubble, { left: 40, top: 120, transform: [{ translateY: bubbleTranslateY }], opacity: bubbleOpacity }]}
      />
      <Animated.View
        style={[styles.floatingBubbleSmall, { left: width * 0.75, top: 70, transform: [{ translateY: bubbleTranslateY }], opacity: bubbleOpacity }]}
      />
      <Animated.View
        style={[styles.floatingBubbleSmall, { left: width * 0.3, top: 200, transform: [{ translateY: bubbleTranslateY }], opacity: bubbleOpacity }]}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MindMate Helper 🤖</Text>
        <Text style={styles.headerSubtitle}>
          {mood ? `You're feeling ${mood}` : 'How can I assist you today?'}
        </Text>
      </View>

      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color="#6a0dad" />
          <Text style={styles.loadingText}>MindMate is typing...</Text>
        </View>
      )}

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          multiline
          editable={!loading}
          placeholderTextColor="#666"
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendBtn, (loading || !input.trim()) && styles.sendBtnDisabled]}
          disabled={loading || !input.trim()}
          activeOpacity={0.7}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #b29ddb, #7a56c9)', // fallback color
    backgroundColor: '#7a56c9', // solid purple background fallback for gradient in RN
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  floatingBubble: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#b994ff88',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingBubbleSmall: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#d8b5ff99',
    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d6c5ff',
    fontStyle: 'italic',
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    maxWidth: '75%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  messageBubble: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#9c27b0',
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: 6,
  },
  userText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  assistantText: {
    color: '#5e2a87',
    fontSize: 17,
    fontWeight: '600',
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderTopWidth: 1,
    borderColor: '#9c27b0',
  },
  loadingText: {
    color: '#d6c5ff',
    marginLeft: 12,
    fontWeight: '700',
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderTopWidth: 1,
    borderColor: '#9c27b0',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: '#4a148c',
    maxHeight: 120,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sendBtn: {
    marginLeft: 14,
    backgroundColor: '#9c27b0',
    borderRadius: 25,
    paddingHorizontal: 22,
    justifyContent: 'center',
    shadowColor: '#7a1fa2',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  sendBtnDisabled: {
    backgroundColor: '#d1a5e0',
  },
});

export default SupportScreen;
