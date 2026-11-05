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
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EducationAppBackground } from '../components/common/EducationAppBackground';
import { TutorService } from '../services/api/tutorService';
import { TutorResponseMode } from '../types/contracts';
import { useAppStore } from '../store/useAppStore';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  mode?: TutorResponseMode;
  sourceReferences?: string[];
}

export default function VocaBotScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppStore((state) => state.user);
  const activeAssessment = useAppStore((state) => state.activeAssessment);

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(15);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Halo! Saya VocaBot Tutor. Tanyakan seputar kurikulum RPL, konsep pemrograman, panduan proyek, atau penjelasan materi kejuruan.',
      time: '09.00',
      mode: 'CURATED',
      sourceReferences: ['Kurasi Resmi VocaTrack'],
    },
  ]);

  const isAssessmentActive = Boolean(activeAssessment);

  const handleSend = async (textToSend?: string) => {
    // 1. Cek proteksi evaluasi aktif (F-10, T-61)
    if (isAssessmentActive) {
      Alert.alert(
        'Tutor Dinonaktifkan',
        'VocaBot ditutup demi integritas evaluasi resmi yang sedang berlangsung. Selesaikan ujian Anda terlebih dahulu.',
        [{ text: 'Mengerti', style: 'default' }]
      );
      return;
    }

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
      const studentId = user?.id || 'user-001';
      // Panggil TutorService adapter resmi (CT-09)
      const res = await TutorService.askTutor(studentId, content, isAssessmentActive);
      setDailyQuota(res.remainingDailyQuota);

      const botMsg: ChatMessage = {
        id: res.messageId,
        sender: 'bot',
        text: res.replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: res.mode,
        sourceReferences: res.sourceReferences,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const botMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text:
          err.code === 'TUTOR_UNAVAILABLE_DURING_ASSESSMENT'
            ? 'Tutor VocaBot tidak dapat diakses selama evaluasi resmi berlangsung.'
            : 'Koneksi AI sedang lambat atau offline. Silakan tanyakan konsep spesifik modul untuk membaca kurasi materi.',
        time: currentTime,
        mode: 'CURATED',
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

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header Section */}
        <View style={styles.header}>
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.backPill}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={12} color="#FFFFFF" />
              <Text style={styles.backPillText}>Kembali</Text>
            </TouchableOpacity>

            {/* Quota Badge */}
            <View style={styles.quotaPill}>
              <Ionicons name="flash-outline" size={13} color="#2B7BF6" />
              <Text style={styles.quotaText}>Kuota AI: {dailyQuota}/15</Text>
            </View>
          </View>

          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>
                Tanya <Text style={styles.blueHighlight}>VocaBot</Text>
              </Text>
              <Text style={styles.subtitle}>
                Tutor cerdas vokasi dengan verifikasi ganda (AI & Kurasi Resmi Guru).
              </Text>
            </View>

            <Image
              source={require('../assets/vocabot_3d.png')}
              style={styles.robotImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Proteksi Evaluasi Aktif Banner (F-10, T-61) */}
        {isAssessmentActive && (
          <View style={styles.assessmentLockBanner}>
            <Ionicons name="lock-closed" size={24} color="#DC2626" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.lockTitle}>Tutor Dinonaktifkan Sementara</Text>
              <Text style={styles.lockDesc}>
                Evaluasi resmi modul{' '}
                <Text style={{ fontWeight: '800' }}>{activeAssessment?.moduleTitle}</Text> sedang
                berlangsung. Akses tutor ditutup demi menjaga integritas nilai.
              </Text>
            </View>
          </View>
        )}

        {/* Popular Questions Card */}
        {!isAssessmentActive && (
          <View style={styles.popularCard}>
            <View style={styles.popularHeader}>
              <Text style={styles.popularTitle}>Topik Kurasi Populer</Text>
            </View>

            <View style={styles.questionButtonsRow}>
              <TouchableOpacity
                style={styles.questionBtn}
                activeOpacity={0.8}
                onPress={() => handleSend('Bagaimana cara kerja flexbox di CSS?')}
              >
                <View style={styles.questionIconBadge}>
                  <Ionicons name="code-slash-outline" size={15} color="#2B7BF6" />
                </View>
                <Text style={styles.questionBtnText}>Cara Kerja Flexbox</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.questionBtn}
                activeOpacity={0.8}
                onPress={() => handleSend('Apa perbedaan useState dan immutability di React?')}
              >
                <View style={styles.questionIconBadge}>
                  <Ionicons name="layers-outline" size={15} color="#2B7BF6" />
                </View>
                <Text style={styles.questionBtnText}>State & Immutability</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Chat Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatArea}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatScroll}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    isBot ? styles.botBubble : styles.userBubble,
                  ]}
                >
                  {/* Mode Label: AI vs CURATED (F-10) */}
                  {isBot && msg.mode && (
                    <View style={styles.modeBadgeRow}>
                      <View
                        style={[
                          styles.modePill,
                          msg.mode === 'AI' ? styles.modePillAi : styles.modePillCurated,
                        ]}
                      >
                        <Ionicons
                          name={msg.mode === 'AI' ? 'sparkles' : 'book'}
                          size={11}
                          color={msg.mode === 'AI' ? '#2563EB' : '#166534'}
                        />
                        <Text
                          style={[
                            styles.modePillText,
                            msg.mode === 'AI' ? styles.modeTextAi : styles.modeTextCurated,
                          ]}
                        >
                          {msg.mode === 'AI' ? 'Tutor AI' : 'Kurasi Resmi (CURATED)'}
                        </Text>
                      </View>
                    </View>
                  )}

                  <Text
                    style={[
                      styles.messageText,
                      isBot ? styles.botMessageText : styles.userMessageText,
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {/* Source Reference if present */}
                  {isBot && msg.sourceReferences && msg.sourceReferences.length > 0 && (
                    <View style={styles.sourceRefBox}>
                      <Ionicons name="information-circle-outline" size={12} color="#64748B" />
                      <Text style={styles.sourceRefText}>
                        Sumber: {msg.sourceReferences.join(', ')}
                      </Text>
                    </View>
                  )}

                  <Text
                    style={[
                      styles.messageTime,
                      isBot ? styles.botTime : styles.userTime,
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
              );
            })}

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
                  VocaBot sedang menganalisis materi kurikulum...
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
            <View style={[styles.inputContainer, isAssessmentActive && styles.inputDisabled]}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={
                  isAssessmentActive
                    ? 'Tutor dikunci selama evaluasi resmi...'
                    : 'Tulis pertanyaanmu di sini...'
                }
                placeholderTextColor="#94A3B8"
                editable={!isAssessmentActive && !isThinking}
                style={styles.textInput}
              />

              <TouchableOpacity
                style={[styles.sendCircleBtn, (isAssessmentActive || isThinking) && styles.sendCircleBtnDisabled]}
                disabled={isAssessmentActive || isThinking}
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
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 4,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B7BF6',
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 5,
    gap: 4,
  },
  backPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  quotaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  quotaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  blueHighlight: {
    color: '#2B7BF6',
  },
  subtitle: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  robotImage: {
    width: 60,
    height: 60,
  },
  assessmentLockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  lockDesc: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 15,
  },
  popularCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  popularHeader: {
    marginBottom: 8,
  },
  popularTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  questionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  questionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  questionIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionBtnText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  chatScroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2B7BF6',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeBadgeRow: {
    marginBottom: 6,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modePillAi: {
    backgroundColor: '#EFF6FF',
  },
  modePillCurated: {
    backgroundColor: '#DCFCE7',
  },
  modePillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  modeTextAi: {
    color: '#1D4ED8',
  },
  modeTextCurated: {
    color: '#166534',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#1E293B',
  },
  sourceRefBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sourceRefText: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },
  messageTime: {
    fontSize: 9.5,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  botTime: {
    color: '#94A3B8',
  },
  inputBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 6,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 4,
    gap: 8,
  },
  inputDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.7,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 40,
  },
  sendCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2B7BF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCircleBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
