import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ForgotPasswordScreen = () => {
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);
  const [email, setEmail] = useState("");

  const handleInputChange = (value) => {
    setEmail(value);
    if (!value) {
      setError(t.validFillAllFields);
    } else if (!validateEmail(value)) {
      setError(t.invalidEmail);
    } else {
      setError("");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!email) {
      setError(t.validFillAllFields);
      return false;
    }
    if (!validateEmail(email)) {
      setError(t.invalidEmail);
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(t.success, t.resetLinkSent);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Firebase Reset Password Error:", error);
      if (error.code === "auth/user-not-found") {
        Alert.alert(t.error, t.emailNotFound);
      } else {
        Alert.alert(t.error, error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.forgotPasswordTitle}</Text>
          <Text style={styles.subtitle}>{t.forgotPasswordSubtitle}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.email}</Text>
            <View
              style={[
                styles.input,
                isEmailFocused && { borderColor: "#008080", borderWidth: 1.5 },
                error && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.inputText}
                placeholder={t.email}
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                value={email}
                onChangeText={handleInputChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>{t.resetPassword}</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>{t.backToLogin}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputText: {
    flex: 1,
    fontSize: 15,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
  resetButton: {
    backgroundColor: "#008080",
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    marginVertical: 16,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  footerLink: {
    color: "#008080",
    fontWeight: "500",
    fontSize: 13,
  },
});

export default ForgotPasswordScreen;