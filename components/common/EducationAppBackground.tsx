import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  G,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

interface EducationAppBackgroundProps {
  variant?: 'light' | 'dashboard' | 'chat';
  style?: object;
}

export const EducationAppBackground: React.FC<EducationAppBackgroundProps> = ({
  variant = 'light',
  style,
}) => {
  const isDashboard = variant === 'dashboard';

  // Palette:
  // On dashboard (solid blue), white accents create a crisp blueprint watermark.
  // On light/chat (pastel sky blue), royal blue, sky blue, and warm amber create an elegant, airy aesthetic.
  const primaryColor = isDashboard ? '#FFFFFF' : '#2563EB';
  const secondaryColor = isDashboard ? 'rgba(255, 255, 255, 0.85)' : '#0284C7';
  const accentColor = isDashboard ? '#FFFFFF' : '#F59E0B';
  const subtleColor = isDashboard ? 'rgba(255, 255, 255, 0.65)' : '#64748B';

  // Balanced opacities: clearly visible ("masih terlihat") yet calm & sophisticated ("tidak terlalu rame")
  const primaryOpacity = isDashboard ? 0.22 : 0.23;
  const secondaryOpacity = isDashboard ? 0.17 : 0.19;
  const accentOpacity = isDashboard ? 0.28 : 0.30;
  const subtleOpacity = isDashboard ? 0.13 : 0.15;

  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 820"
        preserveAspectRatio="xMidYMin slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          {/* Luminous, smooth ambient corner glows */}
          <RadialGradient id="eduGlowTop" cx="15%" cy="8%" r="48%" fx="15%" fy="8%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity={isDashboard ? 0 : 0.15} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="eduGlowMid" cx="88%" cy="45%" r="48%" fx="88%" fy="45%">
            <Stop offset="0%" stopColor="#818CF8" stopOpacity={isDashboard ? 0 : 0.11} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="eduGlowBottom" cx="12%" cy="85%" r="42%" fx="12%" fy="85%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity={isDashboard ? 0 : 0.13} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Ambient atmospheric gradients */}
        <Rect x="0" y="0" width="400" height="820" fill="url(#eduGlowTop)" />
        <Rect x="0" y="0" width="400" height="820" fill="url(#eduGlowMid)" />
        <Rect x="0" y="0" width="400" height="820" fill="url(#eduGlowBottom)" />

        {/* ================================================================= */}
        {/* TOP REGION (Y: 20 - 160) - Framing the Header                      */}
        {/* ================================================================= */}

        {/* 1. Math Radical (√x) - Sleek & precise at Top Left */}
        <G opacity={secondaryOpacity}>
          <Path
            d="M 18 52 L 23 52 L 27 63 L 33 42 L 50 42"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1={38} y1={49} x2={46} y2={57} stroke={secondaryColor} strokeWidth="1.2" strokeLinecap="round" />
          <Line x1={46} y1={49} x2={38} y2={57} stroke={secondaryColor} strokeWidth="1.2" strokeLinecap="round" />
        </G>

        {/* 2. Top-Left Delicate Sparkle Star */}
        <Path
          d="M 68 28 C 68 32, 72 32, 72 32 C 72 32, 68 32, 68 36 C 68 32, 64 32, 64 32 C 64 32, 68 32, 68 28 Z"
          fill={accentColor}
          opacity={accentOpacity}
        />

        {/* 3. Minimalist Graduation Cap (Toga) - Top Right Corner */}
        <G opacity={primaryOpacity}>
          {/* Cap Diamond */}
          <Path
            d="M 336 44 L 360 34 L 384 44 L 360 54 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Under cap curve */}
          <Path
            d="M 346 49 C 346 56, 374 56, 374 49"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          {/* Tassel line & bead */}
          <Path
            d="M 384 44 L 388 52 L 388 60"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <Circle cx={388} cy={62} r={1.6} fill={accentColor} />
        </G>

        {/* 4. Top-Right Subtle 3x3 Technical Dot Grid Matrix */}
        <G opacity={subtleOpacity}>
          {[0, 1, 2].map((col) =>
            [0, 1, 2].map((row) => (
              <Circle
                key={`top-dot-${col}-${row}`}
                cx={356 + col * 10}
                cy={130 + row * 10}
                r={1.2}
                fill={subtleColor}
              />
            ))
          )}
        </G>

        {/* ================================================================= */}
        {/* UPPER-MID REGION (Y: 200 - 400) - Peripheral Accents               */}
        {/* ================================================================= */}

        {/* 5. Minimalist Innovation Lightbulb - Upper Left Margin */}
        <G opacity={secondaryOpacity}>
          <Path
            d="M 18 248 C 12 243, 12 234, 18 229 C 24 224, 32 224, 38 229 C 44 234, 44 243, 38 248 C 35 251, 34 254, 33 257 L 23 257 C 22 254, 21 251, 18 248 Z"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Screw base & filament */}
          <Line x1={24} y1={260} x2={32} y2={260} stroke={secondaryColor} strokeWidth="1.2" strokeLinecap="round" />
          <Line x1={26} y1={263} x2={30} y2={263} stroke={secondaryColor} strokeWidth="1.2" strokeLinecap="round" />
          {/* Subtle glowing filament */}
          <Path d="M 26 242 L 28 236 L 30 242" fill="none" stroke={accentColor} strokeWidth="1" strokeLinecap="round" />
        </G>

        {/* 6. Minimalist Open Book - Upper Right Margin */}
        <G opacity={primaryOpacity}>
          <Path
            d="M 346 230 C 354 227, 362 229, 368 233 C 374 229, 382 227, 390 230 L 390 244 C 382 241, 374 243, 368 247 C 362 243, 354 241, 346 244 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Book Spine */}
          <Line x1={368} y1={233} x2={368} y2={247} stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" />
        </G>

        {/* 7. Subtle Diamond Sparkle - Right Mid */}
        <Path
          d="M 372 320 C 372 324, 376 324, 376 324 C 376 324, 372 324, 372 328 C 372 324, 368 324, 368 324 C 368 324, 372 324, 372 320 Z"
          fill={accentColor}
          opacity={accentOpacity}
        />

        {/* ================================================================= */}
        {/* LOWER-MID REGION (Y: 420 - 620) - Breathing & Directional         */}
        {/* ================================================================= */}

        {/* 8. Vocational Set-Square Ruler - Lower Left Margin */}
        <G opacity={secondaryOpacity}>
          <Path
            d="M 14 485 L 14 525 L 48 525 Z"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <Path d="M 20 500 L 20 519 L 36 519 Z" fill="none" stroke={secondaryColor} strokeWidth="1" />
          <Line x1={14} y1={493} x2={17} y2={493} stroke={secondaryColor} strokeWidth="1.1" />
          <Line x1={14} y1={503} x2={18} y2={503} stroke={secondaryColor} strokeWidth="1.1" />
          <Line x1={14} y1={513} x2={17} y2={513} stroke={secondaryColor} strokeWidth="1.1" />
          <Line x1={25} y1={525} x2={25} y2={522} stroke={secondaryColor} strokeWidth="1.1" />
          <Line x1={35} y1={525} x2={35} y2={521} stroke={secondaryColor} strokeWidth="1.1" />
        </G>

        {/* 9. Minimalist Paper Airplane with Gentle Flight Contrail - Lower Right */}
        <G opacity={primaryOpacity}>
          <Path
            d="M 345 500 L 384 485 L 366 524 L 358 510 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Path d="M 384 485 L 358 510" fill="none" stroke={primaryColor} strokeWidth="1.1" />
          {/* Subtle curved contrail arc */}
          <Path
            d="M 305 530 C 322 528, 338 520, 348 508"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeLinecap="round"
            opacity={0.8}
          />
        </G>

        {/* 10. Subtle 3x3 Dot Grid - Lower Left Accent */}
        <G opacity={subtleOpacity}>
          {[0, 1, 2].map((col) =>
            [0, 1, 2].map((row) => (
              <Circle
                key={`bot-dot-${col}-${row}`}
                cx={20 + col * 9}
                cy={585 + row * 9}
                r={1.2}
                fill={subtleColor}
              />
            ))
          )}
        </G>

        {/* ================================================================= */}
        {/* BOTTOM REGION (Y: 640 - 800) - Vocational Mastery Framing         */}
        {/* ================================================================= */}

        {/* 11. Diploma / Certificate Scroll (Ijazah Vokasi) - Bottom Left */}
        <G opacity={primaryOpacity}>
          <Path
            d="M 18 695 L 44 682 L 49 692 L 23 705 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <Path
            d="M 18 695 C 15 697, 15 701, 18 703 C 21 705, 23 705, 23 705"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.3"
          />
          <Path
            d="M 44 682 C 41 684, 41 688, 44 690 C 47 692, 49 692, 49 692"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.3"
          />
          {/* Golden Ribbon Seal */}
          <Line x1={31} y1={688} x2={35} y2={697} stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M 35 697 L 33 703 M 35 697 L 38 702" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
        </G>

        {/* 12. Minimalist Precision Engineering Gear - Bottom Right */}
        <G opacity={secondaryOpacity}>
          {/* Central concentric rings */}
          <Circle cx={362} cy={695} r={12} fill="none" stroke={secondaryColor} strokeWidth="1.25" />
          <Circle cx={362} cy={695} r={4.5} fill="none" stroke={secondaryColor} strokeWidth="1.1" />
          {/* Clean 4-point cardinal teeth */}
          <Line x1={362} y1={680} x2={362} y2={683} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1={362} y1={707} x2={362} y2={710} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1={347} y1={695} x2={350} y2={695} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1={374} y1={695} x2={377} y2={695} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          {/* Clean diagonal teeth */}
          <Line x1={351} y1={684} x2={353} y2={686} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1={371} y1={704} x2={373} y2={706} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1={351} y1={706} x2={353} y2={704} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1={371} y1={686} x2={373} y2={684} stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
        </G>

        {/* 13. Minimalist Sparkle Accents - Bottom */}
        <Path
          d="M 334 745 C 334 748, 337 748, 337 748 C 337 748, 334 748, 334 751 C 334 748, 331 748, 331 748 C 331 748, 334 748, 334 745 Z"
          fill={accentColor}
          opacity={accentOpacity}
        />
        <Path
          d="M 45 750 C 45 753, 48 753, 48 753 C 48 753, 45 753, 45 756 C 45 753, 42 753, 42 753 C 42 753, 45 753, 45 750 Z"
          fill={secondaryColor}
          opacity={secondaryOpacity}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
});
