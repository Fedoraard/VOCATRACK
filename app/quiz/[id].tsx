import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { QuizContainer } from '../../components/quiz/QuizContainer';
import { QuizTimer } from '../../components/quiz/QuizTimer';
import { MOCK_QUIZ_DATA } from '../../utils/mockData';
import { useAppStore } from '../../store/useAppStore';

export default function QuizScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const quizId = params.id || 'quiz-03';
  const quiz = MOCK_QUIZ_DATA[quizId] || MOCK_QUIZ_DATA['quiz-03'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const addXp = useAppStore((state) => state.addXp);
  const updateNodeStatus = useAppStore((state) => state.updateNodeStatus);

  const currentQuestion = quiz.questions[currentIndex];

  const handleTimeUp = useCallback(() => {
    if (!isAnswerSubmitted && !isQuizFinished) {
      setIsAnswerSubmitted(true);
      Alert.alert('Waktu Habis!', 'Waktu pengerjaan soal ini telah berakhir.');
    }
  }, [isAnswerSubmitted, isQuizFinished]);

  const handleSelectOption = (idx: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(idx);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === currentQuestion.kunciJawaban) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz Selesai!
      setIsQuizFinished(true);
      const finalScorePercentage = Math.round(
        ((score + (selectedAnswer === currentQuestion.kunciJawaban ? 1 : 0)) /
          quiz.questions.length) *
          100
      );

      // Beri reward XP dan buka node berikutnya
      if (finalScorePercentage >= 60) {
        addXp(250);
        updateNodeStatus(quiz.nodeBabId, 'completed');
        // Buka node berikutnya (node-04)
        updateNodeStatus('node-04', 'active');
      }
    }
  };

  const handleCloseQuiz = () => {
    Alert.alert(
      'Keluar dari Evaluasi',
      'Progress kuis yang belum diselesaikan akan hilang. Yakin ingin keluar?',
      [
        { text: 'Lanjutkan Kuis', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <QuizContainer enableAntiScreenshot={true}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCloseQuiz} style={styles.closeButton}>
            <Ionicons name="close" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{quiz.judul}</Text>
            <Text style={styles.headerProgress}>
              Soal {currentIndex + 1} dari {quiz.questions.length}
            </Text>
          </View>
          <View style={styles.shieldIcon}>
            <Ionicons name="lock-closed" size={18} color="#059669" />
          </View>
        </View>

        {!isQuizFinished ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Modular Quiz Timer Component (SCR-05) */}
            <QuizTimer
              durationSeconds={quiz.durasiDetik}
              onTimeUp={handleTimeUp}
              isPaused={isAnswerSubmitted}
            />

            {/* Question Text */}
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>
                {currentQuestion.pertanyaan}
              </Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.pilihan.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.kunciJawaban;

                let optionStyle = styles.optionNormal;
                let textStyle = styles.optionTextNormal;

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = styles.optionCorrect;
                    textStyle = styles.optionTextCorrect;
                  } else if (isSelected && !isCorrect) {
                    optionStyle = styles.optionWrong;
                    textStyle = styles.optionTextWrong;
                  }
                } else if (isSelected) {
                  optionStyle = styles.optionSelected;
                  textStyle = styles.optionTextSelected;
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    disabled={isAnswerSubmitted}
                    onPress={() => handleSelectOption(idx)}
                    style={[styles.optionBase, optionStyle]}
                  >
                    <View style={styles.optionLetterBox}>
                      <Text style={styles.optionLetter}>
                        {String.fromCharCode(65 + idx)}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, textStyle]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation when submitted */}
            {isAnswerSubmitted && (
              <View style={styles.explanationCard}>
                <View style={styles.explanationHeader}>
                  <Ionicons name="information-circle" size={18} color="#4F46E5" />
                  <Text style={styles.explanationTitle}>Pembahasan Kunci:</Text>
                </View>
                <Text style={styles.explanationText}>
                  {currentQuestion.pembahasan}
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          /* Quiz Results View */
          <View style={styles.resultContainer}>
            <View style={styles.trophyCircle}>
              <Ionicons name="trophy" size={48} color="#F59E0B" />
            </View>
            <Text style={styles.resultTitle}>Evaluasi Selesai!</Text>
            <Text style={styles.resultSubtitle}>
              Jawaban Benar: {score} dari {quiz.questions.length} Soal
            </Text>

            <View style={styles.rewardBox}>
              <Ionicons name="flash" size={24} color="#F59E0B" />
              <View>
                <Text style={styles.rewardText}>+250 XP Berhasil Diklaim</Text>
                <Text style={styles.rewardSubtext}>
                  Node bab berikutnya telah berhasil dibuka!
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.replace('/(tabs)/skilltree')}
              style={styles.finishButton}
            >
              <Text style={styles.finishButtonText}>Kembali ke Peta Keahlian</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Bar for Action */}
        {!isQuizFinished && (
          <View style={styles.bottomBar}>
            {!isAnswerSubmitted ? (
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={selectedAnswer === null}
                onPress={handleSubmitAnswer}
                style={[
                  styles.submitButton,
                  selectedAnswer === null && styles.disabledButton,
                ]}
              >
                <Text style={styles.submitButtonText}>Kunci Jawaban</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleNextQuestion}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>
                  {currentIndex + 1 < quiz.questions.length
                    ? 'Soal Selanjutnya →'
                    : 'Lihat Hasil Akhir'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>
    </QuizContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    padding: 6,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerProgress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  shieldIcon: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 10,
  },
  optionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  optionNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  optionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  optionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionLetterBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  optionText: {
    fontSize: 13,
    flex: 1,
  },
  optionTextNormal: {
    color: '#1E293B',
  },
  optionTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#065F46',
    fontWeight: '700',
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  explanationCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  explanationText: {
    fontSize: 12,
    color: '#3730A3',
    lineHeight: 18,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  trophyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  rewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  rewardSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  finishButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
