import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { FloatingVocaBotButton } from '../../components/common/FloatingVocaBotButton';

interface TabIconProps {
  color: string;
  focused: boolean;
}

const KomunitasIcon: React.FC<TabIconProps> = ({ color, focused }) => (
  <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
    {/* Speech Bubble outline */}
    <Path
      d="M 12 3.5 C 6.8 3.5, 2.5 7.1, 2.5 11.5 C 2.5 13.8, 3.6 15.9, 5.4 17.4 L 4.5 21 L 8.6 19.4 C 9.7 19.8, 10.8 20, 12 20 C 17.2 20, 21.5 16.4, 21.5 11.5 C 21.5 7.1, 17.2 3.5, 12 3.5 Z"
      stroke={color}
      strokeWidth={focused ? 2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Avatar head inside bubble */}
    <Circle cx={12} cy={10.2} r={2.5} stroke={color} strokeWidth={focused ? 1.8 : 1.5} />
    {/* Avatar shoulders inside bubble */}
    <Path
      d="M 8.2 16.2 C 8.2 13.8, 10 13.3, 12 13.3 C 14 13.3, 15.8 13.8, 15.8 16.2"
      stroke={color}
      strokeWidth={focused ? 1.8 : 1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export default function TabLayout() {
  const renderTabLabel = (title: string, focused: boolean) => (
    <View style={styles.tabLabelContainer}>
      <Text
        style={[
          styles.tabBarLabel,
          { color: focused ? '#2B7BF6' : '#8C96A5' },
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
        tabBarInactiveTintColor: '#8C96A5',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
      }}
    >
      {/* Tab 1: Beranda */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => renderTabLabel('Beranda', focused),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={focused ? '#2B7BF6' : '#8C96A5'}
            />
          ),
        }}
      />

      {/* Tab 2: Jurusan */}
      <Tabs.Screen
        name="jurusan"
        options={{
          tabBarLabel: ({ focused }) => renderTabLabel('Jurusan', focused),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'school' : 'school-outline'}
              size={23}
              color={focused ? '#2B7BF6' : '#8C96A5'}
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
          tabBarIcon: ({ focused }) => (
            <KomunitasIcon
              color={focused ? '#2B7BF6' : '#8C96A5'}
              focused={focused}
            />
          ),
        }}
      />

      {/* Tab 4: Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused }) => renderTabLabel('Profil', focused),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={focused ? '#2B7BF6' : '#8C96A5'}
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
    height: Platform.OS === 'ios' ? 90 : 74,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 0,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  tabBarLabel: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  activeDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: '#2B7BF6',
    marginTop: 2,
  },
  floatingCenterContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
