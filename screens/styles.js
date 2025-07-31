import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header Styles
  headerGradient: {
    backgroundColor: '#008080',
    paddingTop: isIOS ? 30 : 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  headerContent: {
    alignItems: 'center',
  },

  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },

  appTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Content Styles
  scrollContainer: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Score Card Styles
  scoreCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },

  scoreTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  scoreMessage: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },

  // Progress Ring Styles
  progressRingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  progressRingOuter: {
    width: 100,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressRingInner: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '#ffffff33',
    borderTopColor: '#10b981',
    borderRightColor: '#10b981',
  },

  progressRingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },

  progressLabel: {
    fontSize: 10,
    color: '#ffffff99',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Section Styles
  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },

  // Metric Card Styles
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: width * 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trendIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },

  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },

  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },

  metricNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },

  metricUnit: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
  },

  metricStatus: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Button Styles
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  secondaryActionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },

  // Suggestions and Risk Prediction Styles
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },

  riskPredictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  riskPredictionText: {
    fontSize: 13,
    color: '#4b5563',
  },

  diseaseIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  suggestionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },

  // Additional Styles for Backward Compatibility
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },

  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },

  infoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoIcon: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },

  viewAllText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },

  quickActionsContainer: {
    paddingRight: 20,
  },

  quickActionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  quickActionEmoji: {
    fontSize: 18,
  },

  quickActionTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 12,
  },

  primaryActionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  inputContainer: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 6,
    lineHeight: 18,
  },

  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 13,
    minHeight: 42,
    textAlignVertical: 'center',
  },

  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 13,
    minHeight: 42,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginTop: 2,
  },

  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },

  checkboxText: {
    color: '#ffffff',
    fontSize: 14,
  },

  checkboxLabel: {
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 18,
    flex: 1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  // Welcome Screen Styles
  welcomeHeader: {
    backgroundColor: '#008080',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.35,
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  illustrationContainer: {
    width: 180,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIllustration: {
    width: '100%',
    height: '100%',
  },

  welcomeAppName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 34,
  },

  welcomeTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  welcomeContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },

  welcomeMessageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 30,
  },

  welcomeDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  welcomeSection: {
    marginBottom: 28,
  },

  welcomeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  welcomePicker: {
    height: 54,
    paddingHorizontal: 14,
  },

  privacyContainer: {
    marginBottom: 28,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },

  modernCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    backgroundColor: '#ffffff',
  },

  modernCheckboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },

  checkmarkIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  privacyText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 30,
    flex: 1,
  },

  linkText: {
    color: '#3b82f6',
    fontWeight: '600',
  },

  getStartedButton: {
    backgroundColor: '#008080',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 50,
  },

  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },

  getStartedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 20,
  },

  disabledButtonText: {
    color: '#6b7280',
  },

  footerText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    paddingHorizontal: 16,
  },

  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 14,
    textAlign: 'center',
    lineHeight: 28,
  },

  authDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // Progress Item Styles
  progressItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  progressDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },

  progressMetrics: {
    flexDirection: 'column',
  },

  progressMetric: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 20,
  },

  riskPredictionContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-start',
    width: '100%',
  },

  riskPredictionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },

  riskPredictionList: {
    width: '100%',
  },

  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  achievementBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    width: 120,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  achievementEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },

  achievementText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
});