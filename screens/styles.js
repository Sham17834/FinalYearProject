import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appTagline: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  logo: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
    color: '#ffffff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  scoreMessage: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  metricEmoji: {
    fontSize: 18,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricUnit: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
  },
  metricStatus: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  progressDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  progressMetrics: {
    flexDirection: 'column',
  },
  progressMetric: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
  },
  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkboxText: {
    color: '#ffffff',
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1f2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  welcomeHeader: {
    backgroundColor: '#3c3cbeff',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.4,
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  illustrationContainer: {
    width: 200,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  headerIllustration: {
    width: '100%',
    height: '100%',
  },

  welcomeAppName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },

  welcomeTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
  },

  welcomeContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  welcomeMessageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },

  welcomeDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  welcomeSection: {
    marginBottom: 32,
  },

  welcomeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },

  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  welcomePicker: {
    height: 54,
    paddingHorizontal: 16,
  },

  privacyContainer: {
    marginBottom: 32,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },

  modernCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#ffffff',
  },

  modernCheckboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },

  checkmarkIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  privacyText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    flex: 1,
  },

  linkText: {
    color: '#1e40af',
    fontWeight: '600',
  },

  getStartedButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#1e40af',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },

  getStartedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  disabledButtonText: {
    color: '#9ca3af',
  },

  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});