import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ContentTabType = 'video' | 'reading';

interface DualTabSwitcherProps {
  activeTab: ContentTabType;
  onChangeTab: (tab: ContentTabType) => void;
  videoDuration?: string;
}

export const DualTabSwitcher: React.FC<DualTabSwitcherProps> = ({
  activeTab,
  onChangeTab,
  videoDuration = '12m',
}) => {
  return (
    <View style={styles.container}>
      {/* Video Terpandu Tab */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChangeTab('video')}
        style={[
          styles.tabButton,
          activeTab === 'video' ? styles.activeTabButton : styles.inactiveTabButton,
        ]}
      >
        <Ionicons
          name="play-circle"
          size={18}
          color={activeTab === 'video' ? '#4F46E5' : '#64748B'}
        />
        <Text
          style={[
            styles.tabTitle,
            activeTab === 'video' ? styles.activeTabTitle : styles.inactiveTabTitle,
          ]}
        >
          Video Terpandu
        </Text>
        <View
          style={[
            styles.badge,
            activeTab === 'video' ? styles.activeBadge : styles.inactiveBadge,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              activeTab === 'video' ? styles.activeBadgeText : styles.inactiveBadgeText,
            ]}
          >
            {videoDuration}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Rangkuman Bacaan Tab */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChangeTab('reading')}
        style={[
          styles.tabButton,
          activeTab === 'reading' ? styles.activeTabButton : styles.inactiveTabButton,
        ]}
      >
        <Ionicons
          name="book"
          size={18}
          color={activeTab === 'reading' ? '#4F46E5' : '#64748B'}
        />
        <Text
          style={[
            styles.tabTitle,
            activeTab === 'reading' ? styles.activeTabTitle : styles.inactiveTabTitle,
          ]}
        >
          Rangkuman Bacaan
        </Text>
        <View
          style={[
            styles.badge,
            activeTab === 'reading' ? styles.activeBadge : styles.inactiveBadge,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              activeTab === 'reading' ? styles.activeBadgeText : styles.inactiveBadgeText,
            ]}
          >
            PDF / Teks
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginVertical: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveTabButton: {
    backgroundColor: 'transparent',
  },
  tabTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeTabTitle: {
    color: '#4F46E5',
  },
  inactiveTabTitle: {
    color: '#64748B',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeBadge: {
    backgroundColor: '#EEF2FF',
  },
  inactiveBadge: {
    backgroundColor: '#E2E8F0',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeBadgeText: {
    color: '#4F46E5',
  },
  inactiveBadgeText: {
    color: '#64748B',
  },
});
