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
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";

const RegisterScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert(
        t?.error || "Error",
        t?.validPasswordMatch || "Passwords do not match"
      );
      return;
    }
    if (!fullName || !email || !password) {
      Alert.alert(
        t?.error || "Error",
        t?.validFillAllFields || "Please fill in all fields"
      );
      return;
    }
    console.log("Register:", { fullName, email, password });
    Alert.alert(
      t?.success || "Success",
      t?.registrationSuccess || "Registration successful"
    );
    navigation.navigate("MainApp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t?.registerTitle || "Register"}</Text>
            <Text style={styles.subtitle}>
              {t?.registerSubtitle || "Fill in your details to begin"}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t?.fullName || "Full Name"}
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t?.emailPlaceholder || "Email Address"}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t?.passwordPlaceholder || "Password"}
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t?.confirmPassword || "Confirm Password"}
                placeholderTextColor="#999"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>
                {t?.registerButton || "Register"}
              </Text>
            </TouchableOpacity>
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>
                {t?.haveAccount || "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.bottomTextLink}>
                  {t?.signIn || "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    justifyContent: "flex-start",
  },
  header: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#eee",
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
    height: 56,
    backgroundColor: "#008080",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  bottomText: {
    color: "#666",
    marginRight: 8,
  },
  bottomTextLink: {
    color: "#008080",
    fontWeight: "600",
  },
});

export default RegisterScreen;