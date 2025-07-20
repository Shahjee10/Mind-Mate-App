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
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const SupportScreen = ({ route }) => {
  const { mood } = route.params || {};
  const { userToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: `Hi! I see you are feeling ${mood || 'this way'}. How can I assist you today?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
      // Replace with your backend AI endpoint call here
      const response = await fetch('http://192.168.100.21:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();
      const aiReply = data.reply;

      setMessages(prev => [...prev, { id: Date.now().toString() + 'a', role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + 'e', role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color="#4A90E2" />
          <Text style={styles.loadingText}>MindMate is typing...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          multiline
          editable={!loading}
          placeholderTextColor="#a0a0a0"
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendBtn, (loading || !input.trim()) && styles.sendBtnDisabled]}
          disabled={loading || !input.trim()}
          activeOpacity={0.7}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbe9ff', // soft blue background for calmness
  },
  chatContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    maxWidth: '75%',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#4A90E2', // stronger blue
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF', // white with slight shadow
    borderBottomLeftRadius: 6,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  assistantText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#cde6ff',
    borderTopWidth: 1,
    borderColor: '#a0c4ff',
  },
  loadingText: {
    color: '#4A90E2',
    marginLeft: 10,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#a0c4ff',
    backgroundColor: '#f7faff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 25,
    color: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    maxHeight: 110,
  },
  sendBtn: {
    marginLeft: 14,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: '#357ABD',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#9bbce3',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default SupportScreen;
