import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  G,
  Text as SvgText,
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
  const isChat = variant === 'chat';

  // For dashboard, ALL elements are pure white (as requested: "elemnet nya putih" on blue).
  // For standard light & chat, vibrant blues and warm ambers pop against the soft pale background.
  const topPrimary = isDashboard ? '#FFFFFF' : '#2563EB';
  const topSecondary = isDashboard ? 'rgba(255, 255, 255, 0.82)' : '#0284C7';
  const topAccent = isDashboard ? '#FFFFFF' : '#F59E0B';
  const topSubtle = isDashboard ? 'rgba(255, 255, 255, 0.65)' : '#94A3B8';

  const midPrimary = isDashboard ? '#FFFFFF' : '#2563EB';
  const midSecondary = isDashboard ? 'rgba(255, 255, 255, 0.82)' : '#0284C7';
  const midAccent = isDashboard ? '#FFFFFF' : '#F59E0B';
  const midIndigo = isDashboard ? 'rgba(255, 255, 255, 0.88)' : '#6366F1';
  const midSubtle = isDashboard ? 'rgba(255, 255, 255, 0.65)' : '#94A3B8';

  // Base opacity: 0.38 for dashboard white doodles so they are clearly visible yet elegant
  const baseOpacity = isDashboard ? 0.38 : (isChat ? 0.46 : 0.38);

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
          {/* Soft ambient corner glows for background depth (disabled on solid blue dashboard) */}
          <RadialGradient id="eduGlowTop" cx="15%" cy="8%" r="45%" fx="15%" fy="8%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity={isDashboard ? 0 : 0.18} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="eduGlowMid" cx="88%" cy="45%" r="45%" fx="88%" fy="45%">
            <Stop offset="0%" stopColor="#818CF8" stopOpacity={isDashboard ? 0 : 0.14} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="eduGlowBottom" cx="12%" cy="85%" r="40%" fx="12%" fy="85%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity={isDashboard ? 0 : 0.16} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Ambient atmospheric gradients */}
        <Rect x="0" y="0" width="400" height="820" fill="url(#eduGlowTop)" />
        <Rect x="0" y="0" width="400" height="820" fill="url(#eduGlowMid)" />
        <Rect x="0" y="0" width="400" height="820" fill="url(#eduGlowBottom)" />

        {/* ================================================================= */}
        {/* SECTION 1: TOP AREA (Y: 20 - 220)                                */}
        {/* ================================================================= */}

        {/* 1.1 Dashed curving loop - Top Left */}
        <Path
          d="M 12 28 C 45 12, 75 30, 60 70 C 45 105, 15 110, 32 145 C 48 175, 80 170, 70 205"
          fill="none"
          stroke={topSecondary}
          strokeWidth="1.8"
          strokeDasharray="5 5"
          strokeLinecap="round"
          opacity={baseOpacity}
        />

        {/* 1.2 Graduation Cap (Toga Wisuda) - Top Right */}
        <G opacity={baseOpacity + 0.04}>
          <Path
            d="M 334 45 L 358 35 L 382 45 L 358 55 Z"
            fill="none"
            stroke={topPrimary}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M 344 50 L 344 59 C 344 65, 372 65, 372 59 L 372 50"
            fill="none"
            stroke={topPrimary}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <Path
            d="M 382 45 L 387 53 L 387 63"
            fill="none"
            stroke={topAccent}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <Circle cx={387} cy={65} r={2} fill={topAccent} />
        </G>

        {/* 1.3 Math Radical / Square Root (√x) - Top Left */}
        <G opacity={baseOpacity}>
          <Path
            d="M 22 55 L 26 55 L 30 65 L 36 44 L 52 44"
            fill="none"
            stroke={topPrimary}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1={40} y1={51} x2={48} y2={59} stroke={topPrimary} strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={48} y1={51} x2={40} y2={59} stroke={topPrimary} strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* 1.4 Center-Top: Open Book & Bookmark Doodle */}
        <G opacity={baseOpacity}>
          <Path
            d="M 178 50 C 188 46, 196 48, 202 52 C 208 48, 216 46, 226 50 L 226 66 C 216 62, 208 64, 202 68 C 196 64, 188 62, 178 66 Z"
            fill="none"
            stroke={topPrimary}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Line x1={202} y1={52} x2={202} y2={68} stroke={topPrimary} strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M 200 68 L 200 76 L 203 73 L 206 76 L 206 68" fill={topAccent} opacity={0.6} />
        </G>

        {/* 1.5 Slanted Pencil Doodle - Upper Left */}
        <G opacity={baseOpacity + 0.02}>
          <Path
            d="M 16 115 L 28 88 L 36 92 L 24 119 Z"
            fill="none"
            stroke={topAccent}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path d="M 16 115 L 12 124 L 24 119 Z" fill={topAccent} />
          <Line x1={26} y1={93} x2={34} y2={97} stroke={topAccent} strokeWidth="1.4" />
        </G>

        {/* 1.6 Math Sigma (∑) - Upper Right */}
        <G opacity={baseOpacity}>
          <Path
            d="M 378 105 L 354 105 L 366 117 L 354 129 L 378 129"
            fill="none"
            stroke={topPrimary}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* 1.7 Center Formula: E = mc² Doodle */}
        <G opacity={baseOpacity - 0.05}>
          {/* E */}
          <Path d="M 180 140 L 180 152 L 188 152 M 180 146 L 186 146 M 180 140 L 188 140" fill="none" stroke={topPrimary} strokeWidth="1.6" strokeLinecap="round" />
          {/* = */}
          <Line x1={192} y1={144} x2={198} y2={144} stroke={topPrimary} strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={192} y1={148} x2={198} y2={148} stroke={topPrimary} strokeWidth="1.5" strokeLinecap="round" />
          {/* m */}
          <Path d="M 202 152 L 202 144 Q 205 142, 207 144 L 207 152 Q 210 142, 212 144 L 212 152" fill="none" stroke={topPrimary} strokeWidth="1.5" strokeLinecap="round" />
          {/* c */}
          <Path d="M 221 144 C 218 144, 216 146, 216 148 C 216 150, 218 152, 221 152" fill="none" stroke={topPrimary} strokeWidth="1.5" strokeLinecap="round" />
          {/* ² */}
          <Path d="M 223 140 Q 226 138, 226 140 T 223 143 L 227 143" fill="none" stroke={topAccent} strokeWidth="1.4" strokeLinecap="round" />
        </G>

        {/* 1.8 Top-Right 3x4 Dot Grid Matrix */}
        <G opacity={baseOpacity - 0.06}>
          {[0, 1, 2].map((col) =>
            [0, 1, 2, 3].map((row) => (
              <Circle
                key={`top-dot-${col}-${row}`}
                cx={348 + col * 12}
                cy={145 + row * 12}
                r={1.7}
                fill={topSecondary}
              />
            ))
          )}
        </G>

        {/* 1.9 Sparkles & Accents - Top */}
        <Path
          d="M 105 32 C 105 37, 110 37, 110 37 C 110 37, 105 37, 105 42 C 105 37, 100 37, 100 37 C 100 37, 105 37, 105 32 Z"
          fill={topAccent}
          opacity={0.5}
        />
        <Path
          d="M 312 85 C 312 90, 317 90, 317 90 C 317 90, 312 90, 312 95 C 312 90, 307 90, 307 90 C 307 90, 312 90, 312 85 Z"
          fill={topSecondary}
          opacity={0.46}
        />
        <Circle cx={20} cy={165} r={4.5} fill="none" stroke={topSecondary} strokeWidth="1.5" opacity={baseOpacity} />

        {/* ================================================================= */}
        {/* SECTION 2: UPPER-MID AREA (Y: 220 - 420)                          */}
        {/* ================================================================= */}

        {/* 2.1 Open Book (Buku Terbuka) - Mid Right */}
        <G opacity={baseOpacity}>
          <Path
            d="M 328 230 C 336 227, 345 229, 352 233 C 359 229, 368 227, 376 230 L 376 244 C 368 241, 359 243, 352 247 C 345 243, 336 241, 328 244 Z"
            fill="none"
            stroke={midPrimary}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1={352} y1={233} x2={352} y2={247} stroke={midPrimary} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1={334} y1={234} x2={346} y2={237} stroke={midSecondary} strokeWidth="1.2" strokeLinecap="round" />
          <Line x1={358} y1={237} x2={370} y2={234} stroke={midSecondary} strokeWidth="1.2" strokeLinecap="round" />
        </G>

        {/* 2.2 Set Square Ruler (Penggaris Segitiga Vokasi) - Mid Left */}
        <G opacity={baseOpacity + 0.02}>
          <Path
            d="M 14 235 L 14 280 L 52 280 Z"
            fill="none"
            stroke={midSecondary}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path d="M 20 251 L 20 273 L 38 273 Z" fill="none" stroke={midSecondary} strokeWidth="1.4" />
          <Line x1={14} y1={243} x2={18} y2={243} stroke={midSecondary} strokeWidth="1.4" />
          <Line x1={14} y1={254} x2={18} y2={254} stroke={midSecondary} strokeWidth="1.4" />
          <Line x1={14} y1={265} x2={18} y2={265} stroke={midSecondary} strokeWidth="1.4" />
          <Line x1={26} y1={280} x2={26} y2={276} stroke={midSecondary} strokeWidth="1.4" />
          <Line x1={37} y1={280} x2={37} y2={276} stroke={midSecondary} strokeWidth="1.4" />
        </G>

        {/* 2.3 Center-Mid: Science Microscope / Magnifier Doodle */}
        <G opacity={baseOpacity - 0.04}>
          <Circle cx={195} cy={275} r={9} fill="none" stroke={midSecondary} strokeWidth="1.8" />
          <Line x1={202} y1={282} x2={212} y2={292} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          {/* Star inside magnifier */}
          <Path d="M 195 271 L 196 274 L 199 275 L 196 276 L 195 279 L 194 276 L 191 275 L 194 274 Z" fill={midAccent} />
        </G>

        {/* 2.4 Wavy Dashed Line - Mid Right */}
        <Path
          d="M 386 265 C 360 280, 350 315, 375 340 C 392 360, 375 395, 355 415"
          fill="none"
          stroke={midSecondary}
          strokeWidth="1.8"
          strokeDasharray="4 5"
          strokeLinecap="round"
          opacity={baseOpacity}
        />

        {/* 2.5 Atom / STEM Science Orbit - Mid Right */}
        <G opacity={baseOpacity + 0.02}>
          <Path
            d="M 330 315 C 330 303, 368 303, 368 315 C 368 327, 330 327, 330 315 Z"
            transform="rotate(-28 349 315)"
            fill="none"
            stroke={midIndigo}
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
          <Path
            d="M 330 315 C 330 303, 368 303, 368 315 C 368 327, 330 327, 330 315 Z"
            transform="rotate(28 349 315)"
            fill="none"
            stroke={midSecondary}
            strokeWidth="1.6"
          />
          <Circle cx={349} cy={315} r={3} fill={midIndigo} />
          <Circle cx={366} cy={308} r={1.6} fill={midSecondary} />
        </G>

        {/* 2.6 Center-Mid 2: Calculator / Tech Grid Doodle */}
        <G opacity={baseOpacity - 0.05}>
          <Rect x={180} y={350} width={26} height={34} rx={4} fill="none" stroke={midPrimary} strokeWidth="1.6" />
          <Rect x={184} y={354} width={18} height={7} rx={1.5} fill="none" stroke={midSecondary} strokeWidth="1.2" />
          {/* Key dots */}
          <Circle cx={188} cy={367} r={1.3} fill={midPrimary} />
          <Circle cx={193} cy={367} r={1.3} fill={midPrimary} />
          <Circle cx={198} cy={367} r={1.3} fill={midPrimary} />
          <Circle cx={188} cy={373} r={1.3} fill={midPrimary} />
          <Circle cx={193} cy={373} r={1.3} fill={midPrimary} />
          <Circle cx={198} cy={373} r={1.3} fill={midAccent} />
        </G>

        {/* 2.7 Idea Lightbulb - Mid Left */}
        <G opacity={baseOpacity + 0.04}>
          <Path
            d="M 22 355 C 16 349, 16 339, 23 333 C 30 327, 40 327, 47 333 C 54 339, 54 349, 48 355 C 44 359, 43 362, 42 366 L 28 366 C 27 362, 26 359, 22 355 Z"
            fill="none"
            stroke={midAccent}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1={30} y1={369} x2={40} y2={369} stroke={midAccent} strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={32} y1={372} x2={38} y2={372} stroke={midAccent} strokeWidth="1.6" strokeLinecap="round" />
          {/* Ray bursts */}
          <Line x1={35} y1={320} x2={35} y2={324} stroke={midAccent} strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={17} y1={327} x2={20} y2={330} stroke={midAccent} strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={53} y1={327} x2={50} y2={330} stroke={midAccent} strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* 2.8 Grade A+ Badge Doodle - Mid Left */}
        <G opacity={baseOpacity}>
          <Circle cx={42} cy={410} r={15} fill="none" stroke={midPrimary} strokeWidth="1.6" strokeDasharray="4 3" />
          <Path d="M 34 416 L 38 404 L 42 416 Z" fill="none" stroke={midPrimary} strokeWidth="1.5" />
          <Line x1={35} y1={412} x2={41} y2={412} stroke={midPrimary} strokeWidth="1.3" />
          <Line x1={45} y1={407} x2={51} y2={407} stroke={midAccent} strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={48} y1={404} x2={48} y2={410} stroke={midAccent} strokeWidth="1.6" strokeLinecap="round" />
        </G>

        {/* 2.9 Pi Symbol (π) - Mid Left */}
        <G opacity={baseOpacity}>
          <Line x1={12} y1={300} x2={28} y2={300} stroke={midPrimary} strokeWidth="1.6" strokeLinecap="round" />
          <Path d="M 16 300 L 16 312 C 16 314, 15 315, 13 315" fill="none" stroke={midPrimary} strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={24} y1={300} x2={24} y2={315} stroke={midPrimary} strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* ================================================================= */}
        {/* SECTION 3: LOWER-MID AREA (Y: 420 - 620)                          */}
        {/* ================================================================= */}

        {/* 3.1 Chemistry Erlenmeyer Lab Flask - Lower Right */}
        <G opacity={baseOpacity + 0.02}>
          <Line x1={348} y1={435} x2={358} y2={435} stroke={midSecondary} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1={350} y1={435} x2={350} y2={446} stroke={midSecondary} strokeWidth="1.6" />
          <Line x1={356} y1={435} x2={356} y2={446} stroke={midSecondary} strokeWidth="1.6" />
          <Path
            d="M 350 446 L 334 472 C 332 475, 335 478, 338 478 L 368 478 C 371 478, 374 475, 372 472 L 356 446 Z"
            fill="none"
            stroke={midSecondary}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path d="M 340 468 Q 353 464, 366 468" fill="none" stroke={midPrimary} strokeWidth="1.5" />
          <Circle cx={350} cy={458} r={1.5} fill={midPrimary} />
          <Circle cx={355} cy={452} r={1.2} fill={midPrimary} />
        </G>

        {/* 3.2 Center-Lower: 3 Stacked Books (Tumpukan Buku Pelajaran) */}
        <G opacity={baseOpacity - 0.03}>
          {/* Book 1 (bottom) */}
          <Path d="M 180 475 L 222 475 L 220 482 L 178 482 Z" fill="none" stroke={midPrimary} strokeWidth="1.6" strokeLinejoin="round" />
          {/* Book 2 (middle) */}
          <Path d="M 183 468 L 225 468 L 223 475 L 181 475 Z" fill="none" stroke={midSecondary} strokeWidth="1.6" strokeLinejoin="round" />
          {/* Book 3 (top) */}
          <Path d="M 181 461 L 223 461 L 221 468 L 179 468 Z" fill="none" stroke={midAccent} strokeWidth="1.6" strokeLinejoin="round" />
        </G>

        {/* 3.3 Drafting Compass (Jangka Matematika) - Lower Left */}
        <G opacity={baseOpacity}>
          <Circle cx={25} cy={460} r={2.5} fill="none" stroke={midPrimary} strokeWidth="1.6" />
          <Line x1={25} y1={462} x2={15} y2={488} stroke={midPrimary} strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={25} y1={462} x2={35} y2={488} stroke={midPrimary} strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={18} y1={474} x2={32} y2={474} stroke={midSecondary} strokeWidth="1.3" />
        </G>

        {/* 3.4 Protractor Arc (Busur Derajat) - Lower Left */}
        <G opacity={baseOpacity - 0.02}>
          <Path
            d="M 12 535 A 22 22 0 0 1 56 535 Z"
            fill="none"
            stroke={midSecondary}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <Line x1={34} y1={535} x2={34} y2={530} stroke={midSecondary} strokeWidth="1.4" />
          <Line x1={24} y1={535} x2={26} y2={531} stroke={midSecondary} strokeWidth="1.2" />
          <Line x1={44} y1={535} x2={42} y2={531} stroke={midSecondary} strokeWidth="1.2" />
        </G>

        {/* 3.5 Paper Airplane (Pesawat Kertas) - Lower Right */}
        <G opacity={baseOpacity + 0.04}>
          <Path
            d="M 334 525 L 378 537 L 352 550 L 344 563 L 341 547 Z"
            fill="none"
            stroke={midPrimary}
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Path d="M 378 537 L 341 547" fill="none" stroke={midPrimary} strokeWidth="1.4" />
        </G>

        {/* 3.6 Dashed Airplane Contrail / Flight Path */}
        <Path
          d="M 220 575 C 265 585, 305 565, 335 540"
          fill="none"
          stroke={midAccent}
          strokeWidth="1.8"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity={baseOpacity + 0.02}
        />

        {/* 3.7 Dot Grid Matrix - Lower Right */}
        <G opacity={baseOpacity - 0.06}>
          {[0, 1, 2].map((col) =>
            [0, 1, 2].map((row) => (
              <Circle
                key={`mid-dot-${col}-${row}`}
                cx={350 + col * 12}
                cy={485 + row * 12}
                r={1.6}
                fill={midSubtle}
              />
            ))
          )}
        </G>

        {/* ================================================================= */}
        {/* SECTION 4: BOTTOM AREA (Y: 620 - 800)                             */}
        {/* ================================================================= */}

        {/* 4.1 Diploma / Certificate Scroll (Ijazah Vokasi) - Bottom Left */}
        <G opacity={baseOpacity + 0.02}>
          <Path
            d="M 18 640 L 48 625 L 54 637 L 24 652 Z"
            fill="none"
            stroke={midPrimary}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path
            d="M 18 640 C 15 642, 15 647, 18 650 C 21 653, 24 652, 24 652"
            fill="none"
            stroke={midPrimary}
            strokeWidth="1.8"
          />
          <Path
            d="M 48 625 C 45 627, 45 632, 48 635 C 51 638, 54 637, 54 637"
            fill="none"
            stroke={midPrimary}
            strokeWidth="1.8"
          />
          <Line x1={33} y1={632} x2={38} y2={642} stroke={midAccent} strokeWidth="2.2" strokeLinecap="round" />
          <Path d="M 38 642 L 35 649 M 38 642 L 42 648" stroke={midAccent} strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* 4.2 Center-Bottom: Vocational Gear & Mechanical Spark */}
        <G opacity={baseOpacity - 0.04}>
          <Circle cx={200} cy={645} r={12} fill="none" stroke={midSecondary} strokeWidth="1.6" />
          <Circle cx={200} cy={645} r={4} fill="none" stroke={midSecondary} strokeWidth="1.4" />
          {/* Gear teeth */}
          <Line x1={200} y1={630} x2={200} y2={633} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={200} y1={657} x2={200} y2={660} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={185} y1={645} x2={188} y2={645} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={212} y1={645} x2={215} y2={645} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
        </G>

        {/* 4.3 Engineering Gear (Roda Gigi Teknik) - Bottom Right */}
        <G opacity={baseOpacity}>
          <Circle cx={360} cy={645} r={14} fill="none" stroke={midSecondary} strokeWidth="1.6" />
          <Circle cx={360} cy={645} r={5} fill="none" stroke={midSecondary} strokeWidth="1.4" />
          {/* Teeth */}
          <Line x1={360} y1={628} x2={360} y2={632} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={360} y1={658} x2={360} y2={662} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={343} y1={645} x2={347} y2={645} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={373} y1={645} x2={377} y2={645} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={348} y1={633} x2={351} y2={636} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={369} y1={654} x2={372} y2={657} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={348} y1={657} x2={351} y2={654} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={369} y1={636} x2={372} y2={633} stroke={midSecondary} strokeWidth="2.5" strokeLinecap="round" />
        </G>

        {/* 4.4 Swooshing Flight Trail - Bottom Left */}
        <Path
          d="M 16 680 C 40 700, 20 735, 50 755 C 72 768, 105 760, 125 780"
          fill="none"
          stroke={midAccent}
          strokeWidth="1.8"
          strokeDasharray="4 5"
          strokeLinecap="round"
          opacity={baseOpacity}
        />

        {/* 4.5 Dot Grid Matrix - Bottom Left */}
        <G opacity={baseOpacity - 0.08}>
          {[0, 1, 2].map((col) =>
            [0, 1, 2].map((row) => (
              <Circle
                key={`bot-dot-${col}-${row}`}
                cx={18 + col * 12}
                cy={575 + row * 12}
                r={1.6}
                fill={midSubtle}
              />
            ))
          )}
        </G>

        {/* 4.6 Math Symbols and Sparkles - Bottom */}
        <G opacity={baseOpacity}>
          <Line x1={355} y1={715} x2={365} y2={715} stroke={midSubtle} strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={360} y1={710} x2={360} y2={720} stroke={midSubtle} strokeWidth="1.6" strokeLinecap="round" />
        </G>
        <G opacity={baseOpacity - 0.05}>
          <Line x1={22} y1={725} x2={30} y2={733} stroke={midIndigo} strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={30} y1={725} x2={22} y2={733} stroke={midIndigo} strokeWidth="1.5" strokeLinecap="round" />
        </G>
        <Path
          d="M 330 740 C 330 746, 336 746, 336 746 C 336 746, 330 746, 330 752 C 330 746, 324 746, 324 746 C 324 746, 330 746, 330 740 Z"
          fill={midAccent}
          opacity={0.5}
        />
        <Path
          d="M 40 760 C 40 765, 45 765, 45 765 C 45 765, 40 765, 40 770 C 40 765, 35 765, 35 765 C 35 765, 40 765, 40 760 Z"
          fill={midSecondary}
          opacity={0.46}
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
