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

interface AuthBackgroundDecorationsProps {
  style?: object;
}

export const AuthBackgroundDecorations: React.FC<AuthBackgroundDecorationsProps> = ({ style }) => {
  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 640"
        preserveAspectRatio="xMidYMin slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          {/* Soft ambient corner glows for background depth */}
          <RadialGradient id="softSkyGlow" cx="10%" cy="5%" r="45%" fx="10%" fy="5%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="softIndigoGlow" cx="90%" cy="85%" r="45%" fx="90%" fy="85%">
            <Stop offset="0%" stopColor="#818CF8" stopOpacity={0.09} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Ambient background tints */}
        <Rect x="0" y="0" width="400" height="640" fill="url(#softSkyGlow)" />
        <Rect x="0" y="0" width="400" height="640" fill="url(#softIndigoGlow)" />

        {/* ================================================================= */}
        {/* 1. GARIS PUTUS-PUTUS (DASHED CURVES & PATHWAYS)                    */}
        {/* ================================================================= */}

        {/* Top-Left playful dashed arc */}
        <Path
          d="M 12 25 C 35 12, 60 22, 50 55 C 42 80, 20 90, 32 120 C 42 145, 68 150, 55 175"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          strokeLinecap="round"
          opacity={0.35}
        />

        {/* Top-Right dashed curve */}
        <Path
          d="M 380 30 C 350 20, 325 50, 345 85 C 362 115, 385 130, 368 160"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          strokeLinecap="round"
          opacity={0.32}
        />

        {/* Mid-Left dashed wavy line behind inputs */}
        <Path
          d="M 8 240 C 26 255, 32 285, 14 305 C -2 322, 12 350, 24 370"
          fill="none"
          stroke="#818CF8"
          strokeWidth="1.8"
          strokeDasharray="4 5"
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Mid-Right dashed wave */}
        <Path
          d="M 385 240 C 360 255, 355 290, 375 315 C 390 335, 370 370, 355 390"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.8"
          strokeDasharray="4 5"
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Bottom-Left swooshing flight trail */}
        <Path
          d="M 18 480 C 38 498, 20 530, 48 548 C 68 560, 95 555, 110 570"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeDasharray="4 5"
          strokeLinecap="round"
          opacity={0.35}
        />

        {/* Bottom-Right connecting arc */}
        <Path
          d="M 345 440 C 375 460, 385 500, 360 530"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* ================================================================= */}
        {/* 2. DOTTED GRID MATRICES (ARCHITECTURAL / TECH MINIMALIST)          */}
        {/* ================================================================= */}

        {/* Top-Right 3x4 dot grid */}
        <G opacity={0.28}>
          {[0, 1, 2].map((col) =>
            [0, 1, 2, 3].map((row) => (
              <Circle
                key={`tr-dot-${col}-${row}`}
                cx={345 + col * 13}
                cy={75 + row * 13}
                r={1.8}
                fill="#60A5FA"
              />
            ))
          )}
        </G>

        {/* Bottom-Left 3x3 dot grid */}
        <G opacity={0.26}>
          {[0, 1, 2].map((col) =>
            [0, 1, 2].map((row) => (
              <Circle
                key={`bl-dot-${col}-${row}`}
                cx={18 + col * 12}
                cy={435 + row * 12}
                r={1.6}
                fill="#94A3B8"
              />
            ))
          )}
        </G>

        {/* ================================================================= */}
        {/* 3. MINIMALIST EDUCATION ELEMENTS (LINE ART & ICONS)                */}
        {/* ================================================================= */}

        {/* Top-Left: Graduation Cap (Toga Wisuda) */}
        <G opacity={0.35}>
          {/* Cap rhombus top */}
          <Path
            d="M 16 50 L 38 40 L 60 50 L 38 60 Z"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Skull cap underneath */}
          <Path
            d="M 25 55 L 25 64 C 25 70, 51 70, 51 64 L 51 55"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Tassel cord and bead */}
          <Path
            d="M 60 50 L 65 58 L 65 67"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <Circle cx={65} cy={69} r={2} fill="#F59E0B" />
        </G>

        {/* Top-Right: Open Book (Buku Terbuka) */}
        <G opacity={0.32}>
          <Path
            d="M 326 34 C 334 31, 343 33, 350 37 C 357 33, 366 31, 374 34 L 374 48 C 366 45, 357 47, 350 51 C 343 47, 334 45, 326 48 Z"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line
            x1={350}
            y1={37}
            x2={350}
            y2={51}
            stroke="#2563EB"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <Line
            x1={332}
            y1={38}
            x2={344}
            y2={41}
            stroke="#93C5FD"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <Line
            x1={356}
            y1={41}
            x2={368}
            y2={38}
            stroke="#93C5FD"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </G>

        {/* Mid-Left: Slanted Pencil (Pensil Belajar) */}
        <G opacity={0.35}>
          <Path
            d="M 18 205 L 30 178 L 38 182 L 26 209 Z"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path d="M 18 205 L 14 214 L 26 209 Z" fill="#F59E0B" />
          <Line
            x1={28}
            y1={183}
            x2={36}
            y2={187}
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
        </G>

        {/* Mid-Upper Right: Atom / STEM Science Orbit */}
        <G opacity={0.32}>
          <Path
            d="M 330 190 C 330 178, 368 178, 368 190 C 368 202, 330 202, 330 190 Z"
            transform="rotate(-28 349 190)"
            fill="none"
            stroke="#6366F1"
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
          <Path
            d="M 330 190 C 330 178, 368 178, 368 190 C 368 202, 330 202, 330 190 Z"
            transform="rotate(28 349 190)"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.6"
          />
          <Circle cx={349} cy={190} r={3} fill="#6366F1" />
          <Circle cx={366} cy={183} r={1.6} fill="#38BDF8" />
        </G>

        {/* Mid-Lower Right: Idea Lightbulb */}
        <G opacity={0.34}>
          <Path
            d="M 345 285 C 339 279, 339 269, 346 263 C 353 257, 363 257, 370 263 C 377 269, 377 279, 371 285 C 367 289, 366 292, 365 296 L 351 296 C 350 292, 349 289, 345 285 Z"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1={353} y1={299} x2={363} y2={299} stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={355} y1={302} x2={361} y2={302} stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={358} y1={250} x2={358} y2={254} stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={340} y1={257} x2={343} y2={260} stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={376} y1={257} x2={373} y2={260} stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* Lower-Left: Set Square Ruler (Penggaris Segitiga Teknik) */}
        <G opacity={0.32}>
          <Path
            d="M 15 330 L 15 375 L 52 375 Z"
            fill="none"
            stroke="#0284C7"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path
            d="M 21 346 L 21 368 L 38 368 Z"
            fill="none"
            stroke="#0284C7"
            strokeWidth="1.4"
          />
          <Line x1={15} y1={338} x2={19} y2={338} stroke="#0284C7" strokeWidth="1.4" />
          <Line x1={15} y1={349} x2={19} y2={349} stroke="#0284C7" strokeWidth="1.4" />
          <Line x1={15} y1={360} x2={19} y2={360} stroke="#0284C7" strokeWidth="1.4" />
          <Line x1={26} y1={375} x2={26} y2={371} stroke="#0284C7" strokeWidth="1.4" />
          <Line x1={37} y1={375} x2={37} y2={371} stroke="#0284C7" strokeWidth="1.4" />
        </G>

        {/* Lower-Right: Paper Airplane (Cita-cita & Arah Karir) */}
        <G opacity={0.35}>
          <Path
            d="M 334 400 L 378 412 L 352 425 L 344 438 L 341 422 Z"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Path
            d="M 378 412 L 341 422"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.4"
          />
        </G>

        {/* Lower-Right: Diploma Scroll (Ijazah / Sertifikat Vokasi) */}
        <G opacity={0.32}>
          <Path
            d="M 338 510 L 368 495 L 374 507 L 344 522 Z"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path
            d="M 338 510 C 335 512, 335 517, 338 520 C 341 523, 344 522, 344 522"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.8"
          />
          <Path
            d="M 368 495 C 365 497, 365 502, 368 505 C 371 508, 374 507, 374 507"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.8"
          />
          <Line x1={353} y1={502} x2={358} y2={512} stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <Path d="M 358 512 L 355 519 M 358 512 L 362 518" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* ================================================================= */}
        {/* 4. ACCENTS: SPARKLES, MATH & GEOMETRIC SYMBOLS (✦, +, ○, ~)       */}
        {/* ================================================================= */}

        {/* Sparkle 1 (Amber, near logo left) */}
        <Path
          d="M 68 88 C 68 94, 74 94, 74 94 C 74 94, 68 94, 68 100 C 68 94, 62 94, 62 94 C 62 94, 68 94, 68 88 Z"
          fill="#F59E0B"
          opacity={0.42}
        />

        {/* Sparkle 2 (Cyan, top-right near title) */}
        <Path
          d="M 312 18 C 312 23, 317 23, 317 23 C 317 23, 312 23, 312 28 C 312 23, 307 23, 307 23 C 307 23, 312 23, 312 18 Z"
          fill="#0EA5E9"
          opacity={0.38}
        />

        {/* Sparkle 3 (Amber, bottom-left near button) */}
        <Path
          d="M 30 550 C 30 556, 36 556, 36 556 C 36 556, 30 556, 30 562 C 30 556, 24 556, 24 556 C 24 556, 30 556, 30 550 Z"
          fill="#F59E0B"
          opacity={0.45}
        />

        {/* Geometric ring */}
        <Circle cx={22} cy={140} r={4.5} fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity={0.32} />

        {/* Math plus symbol */}
        <G opacity={0.32}>
          <Line x1={368} y1={462} x2={378} y2={462} stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
          <Line x1={373} y1={457} x2={373} y2={467} stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
        </G>

        {/* Math cross / multiplication */}
        <G opacity={0.28}>
          <Line x1={15} y1={282} x2={23} y2={290} stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
          <Line x1={23} y1={282} x2={15} y2={290} stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* Mini wavy scribble */}
        <Path
          d="M 358 350 Q 363 345, 368 350 T 378 350"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity={0.35}
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
