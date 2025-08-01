import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, SectionList, SafeAreaView, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from './styles';

const screenWidth = Dimensions.get('window').width;

const ProgressScreen = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const progressData = [
    { date: '2025-07-27', steps: 8234, sleep: 7.2, heartRate: 72, bmi: 22.4, riskLevel: 'Low' },
    { date: '2025-07-26', steps: 7500, sleep: 6.8, heartRate: 74, bmi: 22.4, riskLevel: 'Low' },
    { date: '2025-07-25', steps: 9000, sleep: 7.5, heartRate: 71, bmi: 22.4, riskLevel: 'Low' },
    { date: '2025-07-24', steps: 6500, sleep: 6.5, heartRate: 73, bmi: 22.4, riskLevel: 'Medium' },
    { date: '2025-07-23', steps: 8200, sleep: 7.0, heartRate: 72, bmi: 22.4, riskLevel: 'Low' },
    { date: '2025-07-22', steps: 7000, sleep: 6.7, heartRate: 75, bmi: 22.4, riskLevel: 'Medium' },
    { date: '2025-07-21', steps: 8500, sleep: 7.3, heartRate: 70, bmi: 22.4, riskLevel: 'Low' },
    { date: '2025-07-20', steps: 7800, sleep: 6.9, heartRate: 73, bmi: 22.5, riskLevel: 'Low' },
    { date: '2025-07-19', steps: 9200, sleep: 7.4, heartRate: 71, bmi: 22.5, riskLevel: 'Low' },
    { date: '2025-07-18', steps: 6300, sleep: 6.4, heartRate: 74, bmi: 22.5, riskLevel: 'Medium' },
  ];

  const shapRankings = [
    { factor: 'Steps', value: 0.45 },
    { factor: 'Sleep Duration', value: 0.32 },
    { factor: 'Heart Rate', value: 0.15 },
    { factor: 'BMI', value: 0.08 },
    { factor: 'Age', value: 0.05 },
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
  const riskLevels = useMemo(() => filteredData.map(item => item.riskLevel === 'Low' ? 1 : item.riskLevel === 'Medium' ? 2 : 3), [filteredData]);

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
    { title: 'Time Range', data: [{ type: 'timeRange' }], key: 'timeRange' },
    { title: 'Lifestyle Score Trend', data: [{ type: 'lifestyleChart' }], key: 'lifestyleChart' },
    { title: 'Steps & Sleep Trend', data: [{ type: 'stepsSleepChart' }], key: 'stepsSleepChart' },
    { title: 'Risk Level Trend', data: [{ type: 'riskChart' }], key: 'riskChart' },
    { title: 'Top 5 Influencing Factors (SHAP)', data: shapRankings, key: 'shap' },
    { title: 'Weekly Progress', data: filteredData, key: 'progress' },
  ], [filteredData, shapRankings]);

  const renderItem = useCallback(({ item, section }) => {
    if (!section) return null; // Guard against undefined section
    switch (section.key) {
      case 'timeRange':
        return (
          <View style={styles.timeRangeSwitcher}>
            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === '7days' && styles.activeTimeRange]}
              onPress={() => setTimeRange('7days')}
            >
              <Text style={[styles.timeRangeText, timeRange === '7days' && styles.activeTimeRangeText]}>7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeRangeButton, timeRange === '30days' && styles.activeTimeRange]}
              onPress={() => setTimeRange('30days')}
            >
              <Text style={[styles.timeRangeText, timeRange === '30days' && styles.activeTimeRangeText]}>30 Days</Text>
            </TouchableOpacity>
          </View>
        );
      case 'lifestyleChart':
        return (
          <LineChart
            data={{
              labels: filteredData.map(item => item.date.split('-').slice(1).join('/')).reverse(),
              datasets: [{ data: lifestyleScores.slice().reverse() }],
              legend: ['Lifestyle Score'],
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
              legend: ['Steps', 'Sleep (hrs)'],
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
              legend: ['Risk Level'],
            }}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              ...chartConfig,
              formatYLabel: (value) => ['Low', 'Medium', 'High'][parseInt(value) - 1] || value,
            }}
            bezier
            style={styles.chart}
          />
        );
      case 'shap':
        return (
          <View style={styles.shapItem}>
            <Text style={styles.shapFactor}>{item.factor}</Text>
            <Text style={styles.shapValue}>Impact: {(item.value * 100).toFixed(1)}%</Text>
          </View>
        );
      case 'progress':
        return (
          <View style={styles.progressItem}>
            <Text style={styles.progressDate}>{item.date}</Text>
            <View style={styles.progressMetrics}>
              <Text style={styles.progressMetric}>Steps: {item.steps}</Text>
              <Text style={styles.progressMetric}>Sleep: {item.sleep} hrs</Text>
              <Text style={styles.progressMetric}>Heart Rate: {item.heartRate} bpm</Text>
              <Text style={styles.progressMetric}>BMI: {item.bmi}</Text>
              <Text style={styles.progressMetric}>Risk: {item.riskLevel}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  }, [timeRange, filteredData, lifestyleScores, stepsData, sleepData, riskLevels, chartConfig]);

  const renderSectionHeader = useCallback(({ section }) => {
    if (!section || !section.title) return null; // Guard against undefined section or title
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
      // Section header height
      offset += 50; // Approximate height for section header
      for (let i = 0; i < section.data.length; i++) {
        if (currentIndex === index) {
          const length = section.key.includes('Chart') ? 240 : section.key === 'timeRange' ? 60 : section.key === 'shap' ? 60 : 140;
          return { length, offset, index };
        }
        offset += section.key.includes('Chart') ? 240 : section.key === 'timeRange' ? 60 : section.key === 'shap' ? 60 : 140;
        currentIndex++;
      }
    }

    return { length: 0, offset: 0, index }; // Fallback
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.appName}>Progress</Text>
          <Text style={styles.appTagline}>Your health journey over time</Text>
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