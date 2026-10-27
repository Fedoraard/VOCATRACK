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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EducationAppBackground } from '../../components/common/EducationAppBackground';

interface CommunityMessage {
  id: string;
  sender: string;
  avatar?: any;
  text: string;
  time: string;
  isMe: boolean;
}

export default function KomunitasScreen() {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<CommunityMessage[]>([
    {
      id: 'c-1',
      sender: 'Mas Owo',
      avatar: require('../../assets/avatar_owo.png'),
      text: 'Halo Semuanya!',
      time: '08.30',
      isMe: false,
    },
    {
      id: 'c-2',
      sender: 'Saya',
      text: 'Halo, Wowo ayo belajr!',
      time: '08.33 ✓✓',
      isMe: true,
    },
    {
      id: 'c-3',
      sender: 'Anomali',
      avatar: require('../../assets/avatar_anomali.png'),
      text: 'Hayyyuukk',
      time: '08.34',
      isMe: false,
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: CommunityMessage = {
      id: `c-${Date.now()}`,
      sender: 'Saya',
      text: inputText.trim(),
      time: '08.36 ✓✓',
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <EducationAppBackground />

      {/* Decorative background shape */}
      <View style={styles.faintCircleTop} />

      {/* Top Blue Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Ionicons name="people" size={24} color="#FFFFFF" />
          <Text style={styles.headerTitleText}>Komunitas</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
        >
          {messages.map((item) => (
            <View
              key={item.id}
              style={[
                styles.messageRow,
                item.isMe ? styles.myMessageRow : styles.otherMessageRow,
              ]}
            >
              {!item.isMe && (
                <Image
                  source={item.avatar}
                  style={styles.senderAvatar}
                  resizeMode="cover"
                />
              )}

              <View
                style={[
                  styles.messageBubble,
                  item.isMe ? styles.myBubble : styles.otherBubble,
                ]}
              >
                {!item.isMe && (
                  <Text style={styles.senderName}>{item.sender}</Text>
                )}
                <Text
                  style={[
                    styles.messageText,
                    item.isMe ? styles.myMessageText : styles.otherMessageText,
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    item.isMe ? styles.myTimestamp : styles.otherTimestamp,
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            </View>
          ))}
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
              placeholder="Tulis pesanmu di sini..."
              placeholderTextColor="#94A3B8"
              style={styles.textInput}
            />

            <TouchableOpacity
              style={styles.sendCircleBtn}
              activeOpacity={0.85}
              onPress={handleSend}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E8FE',
  },
  faintCircleTop: {
    position: 'absolute',
    top: 90,
    left: -50,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerBar: {
    backgroundColor: '#2B7BF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 26,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  senderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginTop: 2,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  myBubble: {
    backgroundColor: '#3B82F6',
    borderTopRightRadius: 4,
  },
  senderName: {
    color: '#2B7BF6',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  otherMessageText: {
    color: '#1E293B',
    fontWeight: '500',
  },
  myMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontWeight: '600',
  },
  otherTimestamp: {
    color: '#94A3B8',
  },
  myTimestamp: {
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
    height: 50,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2B7BF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
