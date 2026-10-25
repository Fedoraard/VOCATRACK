import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FloatingVocaBotButton } from '../../components/common/FloatingVocaBotButton';

export default function TabLayout() {
  const renderTabLabel = (title: string, focused: boolean) => (
    <View style={styles.tabLabelContainer}>
      <Text
        style={[
          styles.tabBarLabel,
          { color: focused ? '#2B7BF6' : '#94A3B8' },
        ]}
      >
        {title}
      </Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2B7BF6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
      }}
    >
      {/* Tab 1: Beranda / Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => renderTabLabel('Beranda', focused),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={focused ? '#2B7BF6' : '#94A3B8'}
            />
          ),
        }}
      />

      {/* Tab 2: Jurusan */}
      <Tabs.Screen
        name="jurusan"
        options={{
          tabBarLabel: ({ focused }) => renderTabLabel('Jurusan', focused),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'school' : 'school-outline'}
              size={22}
              color={focused ? '#2B7BF6' : '#94A3B8'}
            />
          ),
        }}
      />

      {/* Center Tab: Floating VocaBot Button */}
      <Tabs.Screen
        name="vocabot-tab"
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarButton: () => (
            <View style={styles.floatingCenterContainer}>
              <FloatingVocaBotButton />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />

      {/* Tab 3: Komunitas */}
      <Tabs.Screen
        name="komunitas"
        options={{
          tabBarLabel: ({ focused }) => renderTabLabel('Komunitas', focused),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? 'chatbubble-ellipses'
                  : 'chatbubble-ellipses-outline'
              }
              size={22}
              color={focused ? '#2B7BF6' : '#94A3B8'}
            />
          ),
        }}
      />

      {/* Tab 4: Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused }) => renderTabLabel('Profil', focused),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={focused ? '#2B7BF6' : '#94A3B8'}
            />
          ),
        }}
      />

      {/* Hidden Auxiliary Tab: Skill Tree */}
      <Tabs.Screen
        name="skilltree"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 18,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2B7BF6',
    marginTop: 2,
  },
  floatingCenterContainer: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
