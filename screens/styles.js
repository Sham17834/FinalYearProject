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
    paddingBottom: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center', 
  },

  headerContent: {
    marginBottom: 16,
  },

  appTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    fontFamily: FONT_FAMILY.medium,
  },

  fullWidthListItem: {
    marginBottom: 12,
  },

  fullWidthListItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  smallIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  rightIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  listItemTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  listItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.medium,
    color: "#1f2937",
    marginBottom: 4,
    textAlign: "center",
  },

  listItemSubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    fontWeight: "500",
  },

  listItemDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: "#4b5563",
    lineHeight: 20,
  },

  rightSection: {
    alignItems: "center",
  },

  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  notificationText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.bold,
  },

  infoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },

  infoIcon: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.medium,
    color: "#6b7280",
  },

  viewAllText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
    fontFamily: FONT_FAMILY.medium,
  },

  primaryActionButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  primaryActionText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.bold,
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  inputContainer: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: FONT_FAMILY.medium,
    color: "#1f2937",
    marginBottom: 6,
    lineHeight: 18,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 13,
    fontFamily: FONT_FAMILY.regular,
    minHeight: 42,
    textAlignVertical: "center",
  },

  picker: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 13,
    fontFamily: FONT_FAMILY.regular,
    minHeight: 42,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6b7280",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginTop: 2,
  },

  checkboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },

  checkboxText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
  },

  checkboxLabel: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.regular,
    color: "#1f2937",
    lineHeight: 18,
    flex: 1,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  // Welcome Screen Styles with Font Theme
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
    fontFamily: FONT_FAMILY.bold,
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 34,
  },

  welcomeTagline: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: "rgba(255, 255, 255, 0.9)",
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
    fontFamily: FONT_FAMILY.bold,
    color: "#1f2937",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 30,
  },

  welcomeDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  welcomeSection: {
    marginBottom: 28,
  },

  welcomeSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.medium,
    color: "#1f2937",
    marginBottom: 14,
    textAlign: "center",
    lineHeight: 22,
  },

  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },

  modernCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
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
    fontFamily: FONT_FAMILY.bold,
  },

  privacyText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: "#6b7280",
    lineHeight: 30,
    flex: 1,
  },

  linkText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontFamily: FONT_FAMILY.medium,
  },

  getStartedButton: {
    backgroundColor: "#008080",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 50,
  },

  disabledButton: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
  },

  getStartedButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: FONT_FAMILY.bold,
    color: "#ffffff",
    letterSpacing: 0.5,
    textAlign: "center",
    lineHeight: 20,
  },

  disabledButtonText: {
    color: "#6b7280",
    fontFamily: FONT_FAMILY.medium,
  },

  footerText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.regular,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 18,
    paddingHorizontal: 16,
  },

  authTitle: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: FONT_FAMILY.bold,
    color: "#1f2937",
    marginBottom: 14,
    textAlign: "center",
    lineHeight: 28,
  },

  authDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // Progress Item Styles with Font Theme
  progressItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  progressDate: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.bold,
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 22,
  },

  progressMetrics: {
    flexDirection: "column",
  },

  progressMetric: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: "#6b7280",
    marginBottom: 4,
    lineHeight: 20,
  },
});
