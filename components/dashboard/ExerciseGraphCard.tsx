import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64; // accounting for card & page paddings
const CHART_HEIGHT = 120;

export const ExerciseGraphCard: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  if (!hasData) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Grafik Latihan Soal Kamu</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="stats-chart-outline" size={28} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>Belum Ada Riwayat Latihan</Text>
          <Text style={styles.emptySubtitle}>
            Selesaikan materi dan kuis pertamamu untuk melihat grafik perkembangan kompetensi di sini!
          </Text>
        </View>
      </View>
    );
  }

  // Chart dimensions & point coordinates (normalized to CHART_WIDTH x CHART_HEIGHT)
  // X coordinates spaced across 5 points
  const p1 = { x: 20, y: 95 };
  const p2 = { x: CHART_WIDTH * 0.28, y: 88 };
  const p3 = { x: CHART_WIDTH * 0.52, y: 64 };
  const p4 = { x: CHART_WIDTH * 0.74, y: 55 };
  const p5 = { x: CHART_WIDTH - 20, y: 18 };

  // Smooth cubic Bezier curves connecting the points
  const pathD = `
    M ${p1.x} ${p1.y}
    C ${p1.x + 25} ${p1.y - 12}, ${p2.x - 25} ${p2.y + 12}, ${p2.x} ${p2.y}
    C ${p2.x + 25} ${p2.y - 8}, ${p3.x - 25} ${p3.y + 8}, ${p3.x} ${p3.y}
    C ${p3.x + 25} ${p3.y - 6}, ${p4.x - 25} ${p4.y + 6}, ${p4.x} ${p4.y}
    C ${p4.x + 25} ${p4.y - 18}, ${p5.x - 25} ${p5.y + 18}, ${p5.x} ${p5.y}
  `;

  // Area path for gradient fill
  const areaD = `
    ${pathD}
    L ${p5.x} ${CHART_HEIGHT}
    L ${p1.x} ${CHART_HEIGHT}
    Z
  `;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Grafik Latihan Soal Kamu</Text>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>RPL</Text>
          <Ionicons name="chevron-forward" size={12} color="#2B7BF6" />
        </View>
      </View>

      {/* Chart Canvas */}
      <View style={styles.chartWrapper}>
        {/* Y Axis Labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>60</Text>
          <Text style={styles.axisLabel}>40</Text>
          <Text style={styles.axisLabel}>20</Text>
        </View>

        {/* SVG Drawing */}
        <View style={styles.svgContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#2B7BF6" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#2B7BF6" stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            {/* Horizontal Gridlines */}
            <Line
              x1="0"
              y1="25"
              x2={CHART_WIDTH}
              y2="25"
              stroke="#F1F5F9"
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1="60"
              x2={CHART_WIDTH}
              y2="60"
              stroke="#F1F5F9"
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1="95"
              x2={CHART_WIDTH}
              y2="95"
              stroke="#F1F5F9"
              strokeWidth="1"
            />

            {/* Gradient Fill under Curve */}
            <Path d={areaD} fill="url(#blueGradient)" />

            {/* Main Smooth Line */}
            <Path
              d={pathD}
              fill="none"
              stroke="#2B7BF6"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Blue Node Dots */}
            {[p1, p2, p3, p4, p5].map((pt, idx) => (
              <Circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={5.5}
                fill="#2B7BF6"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}
          </Svg>

          {/* X Axis Labels */}
          <View style={styles.xAxisRow}>
            <Text style={styles.axisLabel}>100</Text>
            <Text style={styles.axisLabel}>280</Text>
            <Text style={styles.axisLabel}>1200</Text>
            <Text style={styles.axisLabel}>250</Text>
            <Text style={styles.axisLabel}>1300</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 2,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxis: {
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    paddingRight: 6,
    paddingVertical: 10,
  },
  svgContainer: {
    flex: 1,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 6,
  },
  axisLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
