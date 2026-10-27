import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EducationAppBackground } from '../components/common/EducationAppBackground';
import { askVocaBot } from '../utils/ai';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function VocaBotScreen() {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Halo! Saya VocaBot AI. Ada yang bisa saya bantu tentang pilihan jurusan, prospek kerja SMK, atau materi belajar vokasi?',
      time: '09.00',
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isThinking) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: content,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const botReply = await askVocaBot(content, messages);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: 'Maaf, terjadi kendala saat menghubungkan ke server AI. Coba tanyakan lagi ya!',
        time: currentTime,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <EducationAppBackground variant="chat" />

      {/* Faint background decorative shapes */}
      <View style={styles.faintCircleTop} />
      <View style={styles.faintCircleBottom} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header Section */}
        <View style={styles.header}>
          {/* Back Button Pill */}
          <TouchableOpacity
            style={styles.backPill}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={12} color="#FFFFFF" />
            <Text style={styles.backPillText}>Kembali</Text>
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>
                Tanya <Text style={styles.blueHighlight}>VocaBot</Text>
              </Text>
              <Text style={styles.subtitle}>
                Dapatkan informasi seputar jurusan, karier, materi, dan tips
                belajar sesuai minatmu.
              </Text>
            </View>

            {/* 3D Robot Illustration */}
            <Image
              source={require('../assets/vocabot_3d.png')}
              style={styles.robotImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Popular Questions Card */}
        <View style={styles.popularCard}>
          <View style={styles.popularHeader}>
            <Text style={styles.popularTitle}>Pertanyaan populer</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>Lihat semua &gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.questionButtonsRow}>
            <TouchableOpacity
              style={styles.questionBtn}
              activeOpacity={0.8}
              onPress={() => handleSend('Peluang karier untuk DKV')}
            >
              <View style={styles.questionIconBadge}>
                <Ionicons name="briefcase-outline" size={16} color="#2B7BF6" />
              </View>
              <Text style={styles.questionBtnText}>
                Peluang karier untuk DKV
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.questionBtn}
              activeOpacity={0.8}
              onPress={() => handleSend('Tips memilih jurusan')}
            >
              <View style={styles.questionIconBadge}>
                <Ionicons name="bulb-outline" size={16} color="#2B7BF6" />
              </View>
              <Text style={styles.questionBtnText}>
                Tips memilih jurusan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat History List */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatArea}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatScroll}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user'
                    ? styles.userBubble
                    : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user'
                      ? styles.userMessageText
                      : styles.botMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    msg.sender === 'user'
                      ? styles.userTime
                      : styles.botTime,
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
            ))}

            {isThinking && (
              <View
                style={[
                  styles.messageBubble,
                  styles.botBubble,
                  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
                ]}
              >
                <ActivityIndicator size="small" color="#2B7BF6" />
                <Text style={[styles.botMessageText, { fontStyle: 'italic', color: '#64748B' }]}>
                  VocaBot sedang berpikir...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Bottom Chat Input Bar */}
          <View
            style={[
              styles.inputBarWrapper,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
                <Ionicons name="attach-outline" size={22} color="#2B7BF6" />
              </TouchableOpacity>

              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Tulis pertanyaanmu di sini..."
                placeholderTextColor="#94A3B8"
                style={styles.textInput}
              />

              <TouchableOpacity
                style={styles.sendCircleBtn}
                activeOpacity={0.85}
                onPress={() => handleSend()}
              >
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EFFF',
  },
  faintCircleTop: {
    position: 'absolute',
    top: 180,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(191, 219, 254, 0.35)',
  },
  faintCircleBottom: {
    position: 'absolute',
    bottom: 120,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(191, 219, 254, 0.3)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 26 : 18,
    paddingBottom: 4,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B7BF6',
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 18,
    marginBottom: 14,
  },
  backPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCol: {
    flex: 1,
    paddingRight: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  blueHighlight: {
    color: '#2B7BF6',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '500',
  },
  robotImage: {
    width: 125,
    height: 95,
  },
  popularCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  popularTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  questionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  questionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  questionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionBtnText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 15,
  },
  chatArea: {
    flex: 1,
  },
  chatScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2B7BF6',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  botMessageText: {
    color: '#1E293B',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  botTime: {
    color: '#94A3B8',
  },
  userTime: {
    color: '#BFDBFE',
  },
  inputBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    height: 52,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  attachBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingHorizontal: 8,
  },
  sendCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2B7BF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
