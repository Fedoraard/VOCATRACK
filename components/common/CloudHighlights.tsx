import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Circle,
} from 'react-native-svg';

interface CloudHighlightsProps {
  style?: object;
  height?: number;
  fadeBottom?: boolean;
}

export const CloudHighlights: React.FC<CloudHighlightsProps> = ({
  style,
  height = 140,
  fadeBottom = false,
}) => {
  return (
    <View pointerEvents="none" style={[styles.container, { height }, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 140"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          {/* Back cloud gradient with highlight */}
          <LinearGradient id="cloudGradBack" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.65} />
            <Stop offset="40%" stopColor="#E0F2FE" stopOpacity={0.50} />
            <Stop offset="100%" stopColor="#BAE6FD" stopOpacity={fadeBottom ? 0 : 0.20} />
          </LinearGradient>

          {/* Mid cloud gradient with bright top highlight */}
          <LinearGradient id="cloudGradMid" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
            <Stop offset="30%" stopColor="#F0F9FF" stopOpacity={0.85} />
            <Stop offset="100%" stopColor="#E0F2FE" stopOpacity={fadeBottom ? 0 : 0.60} />
          </LinearGradient>

          {/* Front cloud pure white with subtle base shadow or fade */}
          <LinearGradient id="cloudGradFront" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
            <Stop offset={fadeBottom ? "65%" : "80%"} stopColor="#FFFFFF" stopOpacity={0.98} />
            <Stop offset="100%" stopColor={fadeBottom ? "#FFFFFF" : "#EBF5FF"} stopOpacity={fadeBottom ? 0 : 0.95} />
          </LinearGradient>
        </Defs>

        {/* ============================================================= */}
        {/* LAYER 1: BACK BILLOWING CLOUDS WITH TRANSITION HIGHLIGHTS      */}
        {/* ============================================================= */}
        <G>
          {/* Back cloud billows */}
          <Path
            d="M -20 70 
               C 10 30, 60 25, 90 50 
               C 120 15, 180 10, 220 40 
               C 255 10, 315 15, 345 45 
               C 375 25, 415 35, 430 70 
               L 430 140 L -20 140 Z"
            fill="url(#cloudGradBack)"
          />
          {/* Back cloud highlight rim */}
          <Path
            d="M -20 70 
               C 10 30, 60 25, 90 50 
               C 120 15, 180 10, 220 40 
               C 255 10, 315 15, 345 45 
               C 375 25, 415 35, 430 70"
            fill="none"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </G>

        {/* ============================================================= */}
        {/* LAYER 2: MID-TIER CLOUDS WITH DISTINCT PUFFS                  */}
        {/* ============================================================= */}
        <G>
          <Path
            d="M -20 85 
               C 20 45, 70 45, 105 70 
               C 135 35, 195 30, 230 65 
               C 270 38, 330 40, 360 75 
               C 390 50, 420 60, 430 85 
               L 430 140 L -20 140 Z"
            fill="url(#cloudGradMid)"
          />
          {/* Mid cloud highlight stroke */}
          <Path
            d="M -20 85 
               C 20 45, 70 45, 105 70 
               C 135 35, 195 30, 230 65 
               C 270 38, 330 40, 360 75 
               C 390 50, 420 60, 430 85"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </G>

        {/* ============================================================= */}
        {/* LAYER 3: FRONT CLOUDS (CRISP WHITE BASE FOR CHARACTERS)        */}
        {/* ============================================================= */}
        <G>
          <Path
            d="M -20 100 
               C 30 65, 85 68, 120 90 
               C 155 60, 225 58, 260 88 
               C 295 62, 355 66, 385 95 
               C 405 82, 425 88, 430 100 
               L 430 140 L -20 140 Z"
            fill="url(#cloudGradFront)"
          />
          {/* Front cloud glowing rim */}
          <Path
            d="M -20 100 
               C 30 65, 85 68, 120 90 
               C 155 60, 225 58, 260 88 
               C 295 62, 355 66, 385 95 
               C 405 82, 425 88, 430 100"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
