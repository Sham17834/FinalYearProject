import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const FONT_FAMILY = {
  regular: isIOS ? "SF Pro Display" : "Roboto",
  medium: isIOS ? "SF Pro Display" : "Roboto-Medium",
  bold: isIOS ? "SF Pro Display" : "Roboto-Bold",
  light: isIOS ? "SF Pro Display" : "Roboto-Light",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  headerContainer: {
    backgroundColor: '#008080',
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
    paddingTop: isIOS ? 44 : 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    marginBottom: 8,
  },

  appName: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: FONT_FAMILY.bold,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 34,
  },

  appTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    fontFamily: FONT_FAMILY.medium,
    textAlign: "center",
    lineHeight: 20,
  },

  // ===============================
  // 🔹 📊 分析屏（例如 SHAP、指标对比）
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },

  timeRangeSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  activeTimeRange: {
    backgroundColor: '#008080',
  },

  timeRangeText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: '#1f2937',
  },

  activeTimeRangeText: {
    color: '#ffffff',
  },

  section: {
    backgroundColor: 'transparent',
    paddingTop: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 24,
  },

  chart: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  shapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  shapFactor: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONT_FAMILY.medium,
    color: '#1f2937',
  },

  shapValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: '#008080',
  },

  progressItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  progressDate: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },

  progressMetrics: {
    flexDirection: 'column',
  },

  progressMetric: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 20,
  },

  primaryActionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: '#ffffff',
    letterSpacing: 0.5,
  },

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
    fontFamily: FONT_FAMILY.bold,
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 34,
  },

  welcomeTagline: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
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
    fontFamily: FONT_FAMILY.bold,
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 30,
  },

  welcomeDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
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
    fontFamily: FONT_FAMILY.medium,
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
  },

  welcomePicker: {
    height: 54,
    paddingHorizontal: 14,
    fontFamily: FONT_FAMILY.regular,
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
    borderWidth: 1,
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
    fontFamily: FONT_FAMILY.bold,
  },

  privacyText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#6b7280',
    lineHeight: 30,
    flex: 1,
  },

  linkText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
  },

  getStartedButton: {
    backgroundColor: '#008080',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 50,
  },

  disabledButton: {
    backgroundColor: '#d1d5db',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  getStartedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.bold,
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 20,
  },

  disabledButtonText: {
    color: '#6b7280',
    fontFamily: FONT_FAMILY.medium,
  },

  footerText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.regular,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    paddingHorizontal: 16,
  },

  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.bold,
    color: '#1f2937',
    marginBottom: 14,
    textAlign: 'center',
    lineHeight: 28,
  },

  authDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});
