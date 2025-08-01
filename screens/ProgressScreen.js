import React, { useState, useMemo, useCallback, useContext } from 'react';
import { View, Text, SectionList, SafeAreaView, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from './styles';
import { LanguageContext } from './LanguageContext';

const screenWidth = Dimensions.get('window').width;

const ProgressScreen = () => {
  const { t } = useContext(LanguageContext);
  const [timeRange, setTimeRange] = useState('7days');

  const progressData = [
    { date: '2025-07-27', steps: 8234, sleep: 7.2, heartRate: 72, bmi: 22.4, riskLevel: t.low },
    { date: '2025-07-26', steps: 7500, sleep: 6.8, heartRate: 74, bmi: 22.4, riskLevel: t.low },
    { date: '2025-07-25', steps: 9000, sleep: 7.5, heartRate: 71, bmi: 22.4, riskLevel: t.low },
    { date: '2025-07-24', steps: 6500, sleep: 6.5, heartRate: 73, bmi: 22.4, riskLevel: t.medium },
    { date: '2025-07-23', steps: 8200, sleep: 7.0, heartRate: 72, bmi: 22.4, riskLevel: t.low },
    { date: '2025-07-22', steps: 7000, sleep: 6.7, heartRate: 75, bmi: 22.4, riskLevel: t.medium },
    { date: '2025-07-21', steps: 8500, sleep: 7.3, heartRate: 70, bmi: 22.4, riskLevel: t.low },
    { date: '2025-07-20', steps: 7800, sleep: 6.9, heartRate: 73, bmi: 22.5, riskLevel: t.low },
    { date: '2025-07-19', steps: 9200, sleep: 7.4, heartRate: 71, bmi: 22.5, riskLevel: t.low },
    { date: '2025-07-18', steps: 6300, sleep: 6.4, heartRate: 74, bmi: 22.5, riskLevel: t.medium },
  ];

  const shapRankings = [
    { factor: t.steps, value: 0.45 },
    { factor: t.sleep, value: 0.32 },
    { factor: t.heartRateLabel.replace(': ', ''), value: 0.15 },
    { factor: t.bmiLabel.replace(': ', ''), value: 0.08 },
    { factor: t.age, value: 0.05 },
  ];

  const filteredData = useMemo(() => 
    timeRange === '7days' ? progressData.slice(0, 7) : progressData, 
    [timeRange]
  );

  const calculateLifestyleScore = useCallback((item) => (
    (item.steps / 10000) * 40 + 
    (item.sleep / 8) * 30 + 
    ((100 - item.heartRate) / 50) * 20 + 
    ((25 - item.bmi) / 5) * 10
  ), []);

  const lifestyleScores = useMemo(() => filteredData.map(item => calculateLifestyleScore(item)), [filteredData, calculateLifestyleScore]);
  const stepsData = useMemo(() => filteredData.map(item => item.steps), [filteredData]);
  const sleepData = useMemo(() => filteredData.map(item => item.sleep), [filteredData]);
  const riskLevels = useMemo(() => filteredData.map(item => item.riskLevel === t.low ? 1 : item.riskLevel === t.medium ? 2 : 3), [filteredData, t.low, t.medium, t.high]);

  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
    style: { borderRadius: 12 },
    propsForDots: { r: '4', strokeWidth: '1', stroke: '#008080' },
    propsForBackgroundLines: { strokeDasharray: '', stroke: '#e5e7eb' },
  }), []);

  const sections = useMemo(() => [
    { title: t.timeRange, data: [{ type: 'timeRange' }], key: 'timeRange' },
    { title: t.lifestyleScoreTrend, data: [{ type: 'lifestyleChart' }], key: 'lifestyleChart' },
    { title: t.stepsSleepTrend, data: [{ type: 'stepsSleepChart' }], key: 'stepsSleepChart' },
    { title: t.riskLevelTrend, data: [{ type: 'riskChart' }], key: 'riskChart' },
    { title: t.shapFactors, data: shapRankings, key: 'shap' },
    { title: t.weeklyProgress, data: filteredData, key: 'progress' },
  ], [filteredData, shapRankings, t.timeRange, t.lifestyleScoreTrend, t.stepsSleepTrend, t.riskLevelTrend, t.shapFactors, t.weeklyProgress]);

  const renderItem = useCallback(({ item, section }) => {
    if (!section) return null; 
    switch (section.key) {
      case 'timeRange':
        return (
          <View style={styles.timeRangeSwitcher}>
            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === '7days' && styles.activeTimeRange]}
              onPress={() => setTimeRange('7days')}
            >
              <Text style={[styles.timeRangeText, timeRange === '7days' && styles.activeTimeRangeText]}>{t.sevenDays}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === '30days' && styles.activeTimeRange]}
              onPress={() => setTimeRange('30days')}
            >
              <Text style={[styles.timeRangeText, timeRange === '30days' && styles.activeTimeRangeText]}>{t.thirtyDays}</Text>
            </TouchableOpacity>
          </View>
        );
      case 'lifestyleChart':
        return (
          <LineChart
            data={{
              labels: filteredData.map(item => item.date.split('-').slice(1).join('/')).reverse(),
              datasets: [{ data: lifestyleScores.slice().reverse() }],
              legend: [t.lifestyleScoreTrend],
            }}
            width={screenWidth - 48}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case 'stepsSleepChart':
        return (
          <LineChart
            data={{
              labels: filteredData.map(item => item.date.split('-').slice(1).join('/')).reverse(),
              datasets: [
                { data: stepsData.slice().reverse(), color: () => `rgba(0, 128, 128, 1)`, strokeWidth: 2 },
                { data: sleepData.slice().reverse(), color: () => `rgba(219, 112, 147, 1)`, strokeWidth: 2 },
              ],
              legend: [t.steps, `${t.sleep} (${t.hrs})`],
            }}
            width={screenWidth - 48}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case 'riskChart':
        return (
          <LineChart
            data={{
              labels: filteredData.map(item => item.date.split('-').slice(1).join('/')).reverse(),
              datasets: [{ data: riskLevels.slice().reverse() }],
              legend: [t.riskLevelTrend],
            }}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              ...chartConfig,
              formatYLabel: (value) => [t.low, t.medium, t.high][parseInt(value) - 1] || value,
            }}
            bezier
            style={styles.chart}
          />
        );
      case 'shap':
        return (
          <View style={styles.shapItem}>
            <Text style={styles.shapFactor}>{item.factor}</Text>
            <Text style={styles.shapValue}>{t.impact}{(item.value * 100).toFixed(1)}%</Text>
          </View>
        );
      case 'progress':
        return (
          <View style={styles.progressItem}>
            <Text style={styles.progressDate}>{item.date}</Text>
            <View style={styles.progressMetrics}>
              <Text style={styles.progressMetric}>{t.stepsLabel}{item.steps}</Text>
              <Text style={styles.progressMetric}>{t.sleepLabel}{item.sleep} {t.hrs}</Text>
              <Text style={styles.progressMetric}>{t.heartRateLabel}{item.heartRate} {t.bpm}</Text>
              <Text style={styles.progressMetric}>{t.bmiLabel}{item.bmi}</Text>
              <Text style={styles.progressMetric}>{t.riskLabel}{item.riskLevel}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  }, [timeRange, filteredData, lifestyleScores, stepsData, sleepData, riskLevels, chartConfig, t.steps, t.sleep, t.hrs, t.low, t.medium, t.high, t.sevenDays, t.thirtyDays, t.lifestyleScoreTrend, t.stepsSleepTrend, t.riskLevelTrend, t.impact, t.stepsLabel, t.sleepLabel, t.heartRateLabel, t.bmiLabel, t.riskLabel]);

  const renderSectionHeader = useCallback(({ section }) => {
    if (!section || !section.title) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    );
  }, []);

  const getItemLayout = useCallback((data, index) => {
    if (!data) return { length: 0, offset: 0, index };

    let offset = 0;
    let currentIndex = 0;

    for (let section of data) {
      offset += 50; 
      for (let i = 0; i < section.data.length; i++) {
        if (currentIndex === index) {
          const length = section.key.includes('Chart') ? 240 : section.key === 'timeRange' ? 60 : section.key === 'shap' ? 60 : 140;
          return { length, offset, index };
        }
        offset += section.key.includes('Chart') ? 240 : section.key === 'timeRange' ? 60 : section.key === 'shap' ? 60 : 140;
        currentIndex++;
      }
    }

    return { length: 0, offset: 0, index };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.appName}>{t.progressTitle}</Text>
          <Text style={styles.appTagline}>{t.progressTagline}</Text>
        </View>
      </View>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item.type || item.factor || item.date + index}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
};

export default ProgressScreen;
