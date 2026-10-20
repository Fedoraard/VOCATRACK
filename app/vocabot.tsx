import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'Halo! Saya VocaBot, asisten cerdas VocaTrack 🤖. Kamu bisa bertanya seputar pilihan jurusan SMK/Politeknik, karir masa depan, atau penjelasan materi bab kuis!',
    time: 'Baru saja',
  },
];

const SUGGESTED_QUESTIONS = [
  'Apa prospek karir terbaik lulusan RPL?',
  'Bagaimana sistem SAW menentukan jurusan untukku?',
  'Tips lolos kuis Dasar Pemrograman Web',
];

export default function VocaBotScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Response simulation
    setTimeout(() => {
      let botResponse =
        'Pertanyaan yang sangat bagus! Di VocaTrack, kurikulum diselaraskan langsung dengan kebutuhan industri 4.0. Pastikan kamu menyelesaikan bab materi dan mengerjakan kuis dengan konsisten untuk membuka badge keahlian berikutnya!';

      if (text.toLowerCase().includes('rpl')) {
        botResponse =
          'Lulusan RPL memiliki prospek karir yang sangat luas: Mobile App Developer, Frontend/Backend Engineer, hingga Cloud Specialist. Rata-rata kebutuhan industri software di Indonesia meningkat lebih dari 20% setiap tahunnya!';
      } else if (text.toLowerCase().includes('saw')) {
        botResponse =
          'Metode SAW (Simple Additive Weighting) di VocaTrack menggabungkan 4 kriteria: Minat & Bakat (35%), Nilai Rapor (25%), Prospek Lapangan Kerja (25%), dan Daya Tampung (15%) untuk memberikan rekomendasi yang objektif.';
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        time: 'Baru saja',
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Messages List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              {msg.sender === 'bot' && (
                <View style={styles.botAvatar}>
                  <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                </View>
              )}
              <View
                style={[
                  styles.bubbleContent,
                  msg.sender === 'user'
                    ? styles.userBubbleContent
                    : styles.botBubbleContent,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userText : styles.botText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.botBubble]}>
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              </View>
              <View style={[styles.bubbleContent, styles.botBubbleContent]}>
                <Text style={styles.typingText}>VocaBot sedang mengetik...</Text>
              </View>
            </View>
          )}

          {/* Quick Suggestions */}
          <View style={styles.suggestionsWrapper}>
            <Text style={styles.suggestionsTitle}>Pertanyaan Populer:</Text>
            {SUGGESTED_QUESTIONS.map((question, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() => handleSend(question)}
                style={styles.suggestionChip}
              >
                <Text style={styles.suggestionChipText}>💡 {question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tanyakan apa saja kepada VocaBot..."
            placeholderTextColor="#94A3B8"
            style={styles.textInput}
            multiline={false}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              !inputText.trim() && styles.disabledSendButton,
            ]}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  botBubble: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  bubbleContent: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubbleContent: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  botBubbleContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#0F172A',
  },
  typingText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  suggestionsWrapper: {
    marginTop: 14,
    gap: 8,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionChipText: {
    fontSize: 12,
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#CBD5E1',
  },
});
