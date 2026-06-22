import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

import { lifeQuestTheme } from '@/constants/lifequest-theme';
import { lifeQuestTypography } from '@/constants/lifequest-typography';

type BarDatum = {
  label: string;
  value: number;
  color?: string;
};

type SegmentDatum = {
  label: string;
  value: number;
  color: string;
};

type LineDatum = {
  label: string;
  value: number;
};

export function MiniBarChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: BarDatum[];
}) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.barChart}>
        {data.map((item) => {
          const height = Math.max(16, Math.round((item.value / maxValue) * 120));
          return (
            <View key={item.label} style={styles.barColumn}>
              <Text style={styles.value}>{item.value}</Text>
              <View
                style={[
                  styles.bar,
                  { height, backgroundColor: item.color ?? lifeQuestTheme.colors.accent },
                ]}
              />
              <Text style={styles.axisLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function SegmentedProgressChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: SegmentDatum[];
}) {
  const total = Math.max(1, data.reduce((acc, item) => acc + item.value, 0));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.segmentTrack}>
        {data.map((item) => (
          <View
            key={item.label}
            style={[
              styles.segment,
              {
                backgroundColor: item.color,
                flex: Math.max(1, item.value),
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label}: {item.value}
            </Text>
            <Text style={styles.legendPercent}>
              {Math.round((item.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PieChartCard({
  title,
  subtitle,
  data,
  centerLabel,
}: {
  title: string;
  subtitle?: string;
  data: SegmentDatum[];
  centerLabel: string;
}) {
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(1, data.reduce((acc, item) => acc + item.value, 0));

  let accumulatedPercent = 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.pieWrap}>
        <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {data.map((item) => {
            const percent = item.value / total;
            const dash = circumference * percent;
            const gap = circumference - dash;
            const rotation = accumulatedPercent * 360 - 90;
            accumulatedPercent += percent;

            return (
              <Circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${dash} ${gap}`}
                strokeLinecap="round"
                rotation={rotation}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
          })}
        </Svg>

        <View style={styles.pieCenter}>
          <Text style={styles.pieCenterValue}>{centerLabel}</Text>
          <Text style={styles.pieCenterText}>Total</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label}: {item.value}
            </Text>
            <Text style={styles.legendPercent}>
              {Math.round((item.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function LineChartCard({
  title,
  subtitle,
  data,
  color = lifeQuestTheme.colors.accent,
}: {
  title: string;
  subtitle?: string;
  data: LineDatum[];
  color?: string;
}) {
  const width = 320;
  const height = 160;
  const padding = 18;
  const maxValue = Math.max(1, ...data.map((item) => item.value));
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points = data
    .map((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (item.value / maxValue) * (height - padding * 2);
      return { x, y, value: item.value, label: item.label };
    });

  const pointString = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = `${points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.lineChartWrap}>
        <Svg height={height} width="100%" viewBox={`0 0 ${width} ${height}`}>
          {[0, 1, 2, 3].map((step) => {
            const y = padding + ((height - padding * 2) / 3) * step;
            return (
              <Line
                key={step}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            );
          })}

          <Path d={areaPath} fill="rgba(92,141,255,0.14)" />
          <Polyline fill="none" points={pointString} stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((point) => (
            <Circle
              key={point.label}
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill={lifeQuestTheme.colors.text}
              stroke={color}
              strokeWidth="2"
            />
          ))}
        </Svg>

        <View style={styles.lineLabels}>
          {data.map((item) => (
            <Text key={item.label} style={styles.lineLabel}>
              {item.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: lifeQuestTheme.colors.cardBorder,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
  },
  title: {
    ...lifeQuestTypography.cardTitle,
    marginBottom: 6,
  },
  subtitle: {
    ...lifeQuestTypography.body,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  barChart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 12,
    minHeight: 170,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  value: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 12,
    marginBottom: 8,
  },
  bar: {
    borderRadius: 14,
    minWidth: 30,
    width: '100%',
  },
  axisLabel: {
    color: lifeQuestTheme.colors.muted,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  segmentTrack: {
    borderRadius: 999,
    flexDirection: 'row',
    height: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  legend: {
    gap: 10,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  legendDot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  legendText: {
    color: lifeQuestTheme.colors.muted,
    flex: 1,
    fontFamily: lifeQuestTheme.fonts.body,
    fontSize: 13,
  },
  legendPercent: {
    color: lifeQuestTheme.colors.text,
    fontFamily: lifeQuestTheme.fonts.label,
    fontSize: 12,
  },
  pieWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pieCenter: {
    alignItems: 'center',
    position: 'absolute',
  },
  pieCenterValue: {
    color: lifeQuestTheme.colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  pieCenterText: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  lineChartWrap: {
    marginTop: 4,
  },
  lineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  lineLabel: {
    color: lifeQuestTheme.colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
});
