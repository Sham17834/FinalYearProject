import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", 
  },

  scrollContainer: {
    paddingBottom: 20,
  },

  headerContainer: {
    backgroundColor: "#008080",
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  appName: {
    fontSize: 28, 
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },

  appTagline: {
    fontSize: 16, 
    color: "#666", 
    fontWeight: "500",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },

  timeRangeSwitcher: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  activeTimeRange: {
    backgroundColor: "#008080",
  },

  timeRangeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666", 
  },

  activeTimeRangeText: {
    color: "#ffffff",
  },

  section: {
    backgroundColor: "transparent",
    paddingTop: 8,
  },

  sectionTitle: {
    fontSize: 16, 
    fontWeight: "600",
    color: "#666", 
    lineHeight: 24,
  },

  chart: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  shapItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  shapFactor: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666", 
  },

  shapValue: {
    fontSize: 16, 
    fontWeight: "600",
    color: "#008080",
  },

  progressItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  progressDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666", 
    marginBottom: 8,
    lineHeight: 22,
  },

  progressMetrics: {
    flexDirection: "column",
  },

  progressMetric: {
    fontSize: 16, 
    color: "#666", 
    marginBottom: 4,
    lineHeight: 20,
  },

  primaryActionButton: {
    backgroundColor: "#008080", 
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  primaryActionText: {
    fontSize: 18, 
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  welcomeHeader: {
    backgroundColor: "#008080",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.35,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  illustrationContainer: {
    width: 180,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },

  headerIllustration: {
    width: "100%",
    height: "100%",
  },

  welcomeAppName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333", 
    marginBottom: 6,
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 34,
  },

  welcomeTagline: {
    fontSize: 16, 
    color: "#666", 
    textAlign: "center",
    fontWeight: "400",
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
    alignItems: "center",
    marginBottom: 32,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", 
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 30,
  },

  welcomeDescription: {
    fontSize: 16, 
    color: "#666", 
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  welcomeSection: {
    marginBottom: 10,
    paddingleft: 100,
  },

  welcomeSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666", 
    marginBottom: 14,
    textAlign: "center",
    lineHeight: 22,
  },

  pickerContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#e9ecef",
    borderRadius: 8,
    minHeight: 50,
    justifyContent: "center",
    marginVertical: 10,
    position: "relative",
  },

  privacyContainer: {
    marginBottom: 10,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },

  modernCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
    backgroundColor: "#ffffff",
  },

  modernCheckboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },

  checkmarkIcon: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },

  privacyText: {
    fontSize: 16, 
    color: "#666", 
    lineHeight: 30,
    flex: 1,
  },

  linkText: {
    color: "#008080", 
    fontWeight: "600",
  },

  getStartedButton: {
    backgroundColor: "#008080",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 50,
  },

  disabledButton: {
    backgroundColor: "#d1d5db",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  getStartedButtonText: {
    fontSize: 18, 
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
    textAlign: "center",
    lineHeight: 20,
  },

  disabledButtonText: {
    color: "#666", 
  },

  footerText: {
    fontSize: 16, 
    color: "#666", 
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 18,
    paddingHorizontal: 16,
  },

  authTitle: {
    fontSize: 28, 
    fontWeight: "bold",
    color: "#333", 
    marginBottom: 14,
    textAlign: "center",
    lineHeight: 28,
  },

  authDescription: {
    fontSize: 16, 
    color: "#666", 
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  switchLabel: {
    fontSize: 16,
    color: "#666", 
    flex: 1,
    marginLeft: 10,
  },

  actionButtonContainer: {
    marginTop: 12,
    gap: 12,
  },

  buttonIcon: {
    marginRight: 8,
  },

  secondaryActionButton: {
    backgroundColor: "#ffffff", 
    borderColor: "#e5e7eb",
  },

  secondaryActionText: {
    color: "#666", 
  },
});