
import { StyleSheet, Dimensions, Platform } from 'react-native';

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
    minHeight: 70, 
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', 
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', 
    flexShrink: 1, 
  },
  appTagline: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    flexShrink: 1,
    lineHeight: 20, 
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
    textAlign: 'center', 
    lineHeight: 32, 
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10, 
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    minHeight: 120, 
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 24,
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
    lineHeight: 16,
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
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 22,
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
    minHeight: 120, 
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
    lineHeight: 16,
    numberOfLines: 2, 
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
    lineHeight: 14,
  },
  primaryButton: {
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16, 
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 50, 
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16, 
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 50, 
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
    minHeight: 48,
    textAlignVertical: 'center',
  },
  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
    minHeight: 48, 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
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
    marginTop: 2, 
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
    lineHeight: 20,
    flex: 1, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', 
  },

  welcomeHeader: {
    backgroundColor: '#3c3cbeff',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.4,
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
    textAlign: 'center',
    lineHeight: 40,
  },

  welcomeTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
    paddingHorizontal: 20, 
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
    textAlign: 'center',
    lineHeight: 36,
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
    lineHeight: 24,
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
    paddingHorizontal: 24, 
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
    minHeight: 56, 
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
    textAlign: 'center',
    lineHeight: 22,
  },

  disabledButtonText: {
    color: '#9ca3af',
  },

  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingHorizontal: 20, 
  },

  // Auth Choice Screen Styles
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 32,
  },

  authDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
