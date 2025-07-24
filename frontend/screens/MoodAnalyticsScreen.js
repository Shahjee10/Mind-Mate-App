import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FunkyBackButton from '../components/FunkyBackButton';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// Mood scale and labels for y-axis and legend
const moodScale = {
  5: { label: 'Happy', emoji: '😊' },
  4: { label: 'Excited', emoji: '🤩' },
  3: { label: 'Neutral', emoji: '😐' },
  2: { label: 'Anxious', emoji: '😰' },
  1: { label: 'Sad/Angry', emoji: '😠' },
  0: { label: 'No Data', emoji: '❓' },
};

const chartConfig = {
  backgroundColor: '#f0f4f8',
  backgroundGradientFrom: '#e6d4f3',
  backgroundGradientTo: '#f9f9fb',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(106, 27, 154, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(75, 0, 130, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#6a1b9a',
  },
};

const MoodAnalyticsScreen = () => {
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const res = await axios.get('http://192.168.100.21:5000/api/moods/history', {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i)); // oldest to newest
          return {
            fullDate: date.toLocaleDateString('en-GB'),
            shortLabel: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          };
        });

        const moodMap = {
          happy: 5,
          excited: 4,
          neutral: 3,
          anxious: 2,
          sad: 1,
          angry: 1,
        };

        const moodData = last7Days.map(({ fullDate }) => {
          const moodsForDay = res.data.filter((entry) => {
            const entryDate = new Date(entry.createdAt).toLocaleDateString('en-GB');
            return entryDate === fullDate;
          });

          if (moodsForDay.length === 0) return 0;

          const avgMood =
            moodsForDay.reduce((sum, item) => {
              const normalized = item.mood?.toLowerCase();
              return sum + (moodMap[normalized] || 3);
            }, 0) / moodsForDay.length;

          return Number(avgMood.toFixed(1));
        });

        setChartData({
          labels: last7Days.map(d => d.shortLabel),
          datasets: [{ data: moodData }],
        });
      } catch (err) {
        console.error('Failed to fetch mood data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [userToken]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6a1b9a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back button positioned absolutely */}
      <View style={styles.backButtonContainer}>
        <FunkyBackButton onPress={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Mood Trend (Past 7 Days)</Text>

        {chartData ? (
          <>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={280}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              verticalLabelRotation={-30}
              fromZero
              yAxisSuffix=""
              yLabelsOffset={10}
              yAxisInterval={1} // show all y-axis labels
              formatYLabel={(yValue) => moodScale[Math.round(yValue)]?.emoji || ''}
              segments={5}
            />

            <View style={styles.legendContainer}>
              {Object.entries(moodScale)
                .filter(([key]) => key !== '0')
                .sort((a, b) => b[0] - a[0])
                .map(([value, { label, emoji }]) => (
                  <View key={value} style={styles.legendItem}>
                    <Text style={styles.legendEmoji}>{emoji}</Text>
                    <Text style={styles.legendLabel}>{label}</Text>
                  </View>
                ))}
            </View>
          </>
        ) : (
          <Text style={{ color: '#6a1b9a', marginTop: 20 }}>No mood data found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },
  container: {
    paddingTop: 100, // space for back button
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    color: '#4b0082',
  },
  chart: {
    borderRadius: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 28,
    gap: 14,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    backgroundColor: '#e6d4f3',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: '#7d4ba6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  legendEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    color: '#4b0082',
    fontWeight: '600',
  },
});

export default MoodAnalyticsScreen;
