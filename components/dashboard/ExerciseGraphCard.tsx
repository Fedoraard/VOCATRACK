import React, { useState } from 'react';
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
const CHART_HEIGHT = 125;

export const ExerciseGraphCard: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [chartWidth, setChartWidth] = useState(width - 110);

  // Exact coordinates matching Figma reference image S-curve:
  // Gridlines are at Y = 16 (for 60), Y = 56 (for 40), Y = 96 (for 20)
  // Point 1 (X=100): Y is below 20 gridline (~108)
  // Point 2 (X=280): Y is just below 20 gridline (~98)
  // Point 3 (X=1200): Y is between 20 and 40 (~72)
  // Point 4 (X=250): Y is below 40 (~62)
  // Point 5 (X=1300): Y is at top line 60 (~16)
  const p1 = { x: 18, y: 108 };
  const p2 = { x: chartWidth * 0.28, y: 98 };
  const p3 = { x: chartWidth * 0.52, y: 72 };
  const p4 = { x: chartWidth * 0.74, y: 62 };
  const p5 = { x: chartWidth - 18, y: 16 };

  // Smooth Bezier curves exactly matching Figma reference
  const pathD = `
    M ${p1.x} ${p1.y}
    C ${p1.x + 22} ${p1.y - 12}, ${p2.x - 22} ${p2.y + 4}, ${p2.x} ${p2.y}
    C ${p2.x + 26} ${p2.y - 8}, ${p3.x - 26} ${p3.y + 12}, ${p3.x} ${p3.y}
    C ${p3.x + 24} ${p3.y - 6}, ${p4.x - 24} ${p4.y + 6}, ${p4.x} ${p4.y}
    C ${p4.x + 26} ${p4.y - 18}, ${p5.x - 26} ${p5.y + 18}, ${p5.x} ${p5.y}
  `;

  // Area fill under curve
  const areaD = `
    ${pathD}
    L ${p5.x} ${CHART_HEIGHT}
    L ${p1.x} ${CHART_HEIGHT}
    Z
  `;

  return (
    <View style={styles.card}>
      {/* Header Row on Soft Blue Card */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Grafik Latihan Soal Kamu</Text>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>RPL</Text>
          <Ionicons name="chevron-forward" size={12} color="#2B7BF6" />
        </View>
      </View>

      {/* Crisp White Inner Chart Container */}
      <View style={styles.chartWhiteCard}>
        {!hasData ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bar-chart-outline" size={28} color="#2B7BF6" />
            </View>
            <Text style={styles.emptyTitle}>Belum Ada Riwayat Latihan</Text>
            <Text style={styles.emptySubtitle}>
              Selesaikan latihan formatif atau evaluasi modul untuk mulai melacak grafik performa belajarmu.
            </Text>
          </View>
        ) : (
          <View style={styles.chartWrapper}>
            {/* Y Axis Labels accurately aligned with gridlines */}
            <View style={styles.yAxis}>
              <Text style={[styles.yAxisLabel, { top: 7 }]}>60</Text>
              <Text style={[styles.yAxisLabel, { top: 47 }]}>40</Text>
              <Text style={[styles.yAxisLabel, { top: 87 }]}>20</Text>
            </View>

            {/* SVG Drawing Canvas */}
            <View
              style={styles.svgContainer}
              onLayout={(e) => {
                const layoutWidth = e.nativeEvent.layout.width;
                if (layoutWidth > 0 && Math.abs(layoutWidth - chartWidth) > 2) {
                  setChartWidth(layoutWidth);
                }
              }}
            >
              <Svg width={chartWidth} height={CHART_HEIGHT}>
                <Defs>
                  <LinearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#3A93FD" stopOpacity={0.35} />
                    <Stop offset="100%" stopColor="#3A93FD" stopOpacity={0.02} />
                  </LinearGradient>
                </Defs>

                {/* Faint Horizontal Gridlines aligned with Y=60, Y=40, Y=20 */}
                <Line
                  x1="0"
                  y1="16"
                  x2={chartWidth}
                  y2="16"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <Line
                  x1="0"
                  y1="56"
                  x2={chartWidth}
                  y2="56"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <Line
                  x1="0"
                  y1="96"
                  x2={chartWidth}
                  y2="96"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />

                {/* Gradient Fill under Curve */}
                <Path d={areaD} fill="url(#blueAreaGrad)" />

                {/* Main Smooth Curve Line */}
                <Path
                  d={pathD}
                  fill="none"
                  stroke="#2B7BF6"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Blue Node Dots with White Outline */}
                {[p1, p2, p3, p4, p5].map((pt, idx) => (
                  <Circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={5.5}
                    fill="#2B7BF6"
                    stroke="#FFFFFF"
                    strokeWidth={1.8}
                  />
                ))}
              </Svg>

              {/* X Axis Labels aligned under points */}
              <View style={styles.xAxisRow}>
                <Text style={styles.axisLabel}>100</Text>
                <Text style={styles.axisLabel}>280</Text>
                <Text style={styles.axisLabel}>1200</Text>
                <Text style={styles.axisLabel}>250</Text>
                <Text style={styles.axisLabel}>1300</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EBF4FE',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#2B7BF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    gap: 3,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B7BF6',
  },
  chartWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxis: {
    width: 24,
    height: CHART_HEIGHT,
    position: 'relative',
    marginRight: 6,
  },
  svgContainer: {
    flex: 1,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 8,
  },
  yAxisLabel: {
    position: 'absolute',
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  axisLabel: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptyContainer: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
});
