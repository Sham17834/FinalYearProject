import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import { styles } from "./styles";

const WelcomeScreen = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigation = useNavigation();
  const { language, changeLanguage, t } = useContext(LanguageContext);

  const handleGetStarted = () => {
    if (!agreedToTerms) {
      Alert.alert("Error", t.errorPleaseAgree);
      return;
    }
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.illustrationContainer}>
              <Image
                source={require("../assets/Healthy lifestyle-cuate.png")}
                style={styles.headerIllustration}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeAppName}>{t.appName}</Text>
            <Text style={styles.welcomeTagline}>{t.tagline}</Text>
          </View>
        </View>
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeMessageContainer}>
            <Text style={styles.welcomeTitle}>{t.welcome}</Text>
            <Text style={styles.welcomeDescription}>
              {t.welcomeDescription}
            </Text>
          </View>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeSectionTitle}>{t.chooseLanguage}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={language}
                style={styles.welcomePicker}
                onValueChange={(itemValue) => changeLanguage(itemValue)}
              >
                <Picker.Item label="English" value="English" />
                <Picker.Item label="中文" value="Chinese" />
                <Picker.Item label="Bahasa Malaysia" value="Malay" />
              </Picker>
            </View>
          </View>
          <View style={styles.privacyContainer}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View
                style={[
                  styles.modernCheckbox,
                  agreedToTerms && styles.modernCheckboxChecked,
                ]}
              >
                {agreedToTerms && <Text style={styles.checkmarkIcon}>✓</Text>}
              </View>
              <Text style={styles.privacyText}>
                {t.agreeTerms}{" "}
                <Text style={styles.linkText}>{t.termsOfService}</Text> {t.and}{" "}
                <Text style={styles.linkText}>{t.privacyPolicy}</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.getStartedButton,
              !agreedToTerms && styles.disabledButton,
            ]}
            onPress={handleGetStarted}
            disabled={!agreedToTerms}
          >
            <Text
              style={[
                styles.getStartedButtonText,
                !agreedToTerms && styles.disabledButtonText,
              ]}
            >
              {t.getStarted}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>{t.footerText}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;