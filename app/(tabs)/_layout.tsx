import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FloatingVocaBotButton } from '../../components/common/FloatingVocaBotButton';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* Tab 1: Beranda / Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={(color as string) || (focused ? '#4F46E5' : '#94A3B8')}
            />
          ),
        }}
      />

      {/* Tab 2: Jurusan (SCR-02) */}
      <Tabs.Screen
        name="jurusan"
        options={{
          title: 'Jurusan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'school' : 'school-outline'}
              size={22}
              color={(color as string) || (focused ? '#4F46E5' : '#94A3B8')}
            />
          ),
        }}
      />

      {/* Center Tab: Floating VocaBot Button */}
      <Tabs.Screen
        name="vocabot-tab"
        options={{
          title: 'VocaBot',
          tabBarButton: () => (
            <View style={styles.floatingCenterContainer}>
              <FloatingVocaBotButton />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Mencegah navigasi tab biasa karena ditangani oleh FloatingVocaBotButton
            e.preventDefault();
          },
        }}
      />

      {/* Tab 3: Peta Keterampilan / Skill-Tree (SCR-03) */}
      <Tabs.Screen
        name="skilltree"
        options={{
          title: 'Skill Tree',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'git-network' : 'git-network-outline'}
              size={22}
              color={(color as string) || (focused ? '#4F46E5' : '#94A3B8')}
            />
          ),
        }}
      />

      {/* Tab 4: Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={(color as string) || (focused ? '#4F46E5' : '#94A3B8')}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  floatingCenterContainer: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
