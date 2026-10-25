import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface CareerTargetModalProps {
  visible: boolean;
  onClose: () => void;
  jurusanCode: string;
}

const PROFESSIONS = [
  'Network Engineer',
  'Network Administrator',
  'Network Security Specialist',
  'Cloud Infrastructure Engineer',
  'IT Support Engineer',
];

export const CareerTargetModal: React.FC<CareerTargetModalProps> = ({
  visible,
  onClose,
  jurusanCode,
}) => {
  const [hasTarget, setHasTarget] = useState(false);
  const [profSearch, setProfSearch] = useState('');

  useEffect(() => {
    if (visible) {
      setHasTarget(false);
      setProfSearch('');
    }
  }, [visible]);

  const handleSelectProfession = (prof: string) => {
    onClose();
    setHasTarget(false);
    router.push('/materi/list');
  };

  const handleExplore = () => {
    onClose();
    setHasTarget(false);
    router.push('/materi/list');
  };

  const filteredProfessions = PROFESSIONS.filter((p) =>
    p.toLowerCase().includes(profSearch.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.7}
            onPress={() => {
              setHasTarget(false);
              onClose();
            }}
          >
            <Ionicons name="close" size={22} color="#475569" />
          </TouchableOpacity>

          {/* Title & Subtitle */}
          <Text style={styles.modalTitle}>SATU LANGKAH LAGI!</Text>
          <Text style={styles.modalSubtitle}>
            Apakah kamu sudah punya target karier impianmu?
          </Text>

          {/* If NOT hasTarget: Show the two choices (Image 2) */}
          {!hasTarget ? (
            <View style={styles.choicesContainer}>
              {/* Option 1: Sudah Punya Target! */}
              <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.88}
                onPress={() => setHasTarget(true)}
              >
                <Image
                  source={require('../../assets/target_celebrate.png')}
                  style={styles.optionImage}
                  resizeMode="contain"
                />
                <View style={styles.optionBlueBtn}>
                  <Text style={styles.optionBlueBtnText}>
                    Sudah Punya Target!
                  </Text>
                </View>
                <Text style={styles.optionDesc}>
                  Saya sudah tahu ingin bekerja sebagai apa, bantu saya buatkan
                  jalurnya.
                </Text>
              </TouchableOpacity>

              {/* Option 2: Eksplorasi & Temukan */}
              <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.88}
                onPress={handleExplore}
              >
                <Image
                  source={require('../../assets/target_explore.png')}
                  style={styles.optionImage}
                  resizeMode="contain"
                />
                <View style={styles.optionBlueBtn}>
                  <Text style={styles.optionBlueBtnText}>
                    Eksplorasi & Temukan
                  </Text>
                </View>
                <Text style={styles.optionDesc}>
                  Saya masih bingung, biarkan VocaTrack menganalisis potensiku
                  seiring aku belajar.
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* If hasTarget: Show Profession Search & List (Image 5) */
            <View style={styles.targetSelectedContainer}>
              {/* Compact top card */}
              <View style={[styles.optionCard, styles.compactOptionCard]}>
                <Image
                  source={require('../../assets/target_celebrate.png')}
                  style={styles.compactImage}
                  resizeMode="contain"
                />
                <View style={styles.optionBlueBtn}>
                  <Text style={styles.optionBlueBtnText}>
                    Sudah Punya Target!
                  </Text>
                </View>
                <Text style={styles.optionDesc}>
                  Saya sudah tahu ingin bekerja sebagai apa, bantu saya buatkan
                  jalurnya.
                </Text>
              </View>

              {/* Search Bar */}
              <View style={styles.profSearchBar}>
                <Ionicons name="search-outline" size={16} color="#94A3B8" />
                <TextInput
                  value={profSearch}
                  onChangeText={setProfSearch}
                  placeholder="Cari profesi..."
                  placeholderTextColor="#94A3B8"
                  style={styles.profInput}
                />
              </View>

              {/* Professions List */}
              <ScrollView
                style={styles.professionsScroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
              >
                {filteredProfessions.map((prof, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.professionPill}
                    activeOpacity={0.7}
                    onPress={() => handleSelectProfession(prof)}
                  >
                    <Text style={styles.professionText}>{prof}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2B7BF6',
    paddingVertical: 18,
    paddingHorizontal: 16,
    position: 'relative',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2B7BF6',
    textAlign: 'center',
    marginTop: 4,
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
    paddingHorizontal: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  choicesContainer: {
    gap: 12,
  },
  optionCard: {
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  compactOptionCard: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  optionImage: {
    width: 170,
    height: 100,
    marginBottom: 8,
  },
  compactImage: {
    width: 130,
    height: 70,
    marginBottom: 6,
  },
  optionBlueBtn: {
    backgroundColor: '#2B7BF6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionBlueBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 15,
    fontWeight: '500',
    paddingHorizontal: 6,
  },
  targetSelectedContainer: {
    maxHeight: 440,
  },
  profSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    height: 40,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  profInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  professionsScroll: {
    maxHeight: 190,
  },
  professionPill: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  professionText: {
    color: '#2B7BF6',
    fontSize: 12,
    fontWeight: '700',
  },
});
