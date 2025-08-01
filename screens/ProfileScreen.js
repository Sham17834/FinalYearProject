import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Linking,
  Alert,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const FONT_FAMILY = {
  regular: isIOS ? "SF Pro Display" : "Roboto",
  medium: isIOS ? "SF Pro Display" : "Roboto-Medium",
  bold: isIOS ? "SF Pro Display" : "Roboto-Bold",
  light: isIOS ? "SF Pro Display" : "Roboto-Light",
};

const COLORS = {
  primary: '#008080',
  primaryDark: '#006666',
  primaryLight: '#20a5a5',
  secondary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textInverse: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [age, setAge] = useState('30');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [gender, setGender] = useState('Male');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState('daily');
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const handleSave = () => {
    Alert.alert(
      'Profile Saved',
      'Your profile has been updated successfully!',
      [{ text: 'OK', style: 'default' }]
    );
    console.log('Saved:', { name, email, age, height, weight, gender, isOfflineMode, notificationsEnabled, notificationFrequency });
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.who.int/about/policies/privacy').catch(err => 
      Alert.alert('Error', 'Unable to open privacy policy')
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Account deletion requested')
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'default',
          onPress: () => {
            console.log('User logged out successfully');
            
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }]
            });
          }
        }
      ]
    );
  };

  const SwitchRow = ({ label, value, onValueChange, description }) => (
    <View style={styles.switchContainer}>
      <View style={styles.switchContent}>
        <Text style={styles.switchLabel}>{label}</Text>
        {description && <Text style={styles.switchDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e5e7eb', true: '#008080' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#e5e7eb"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.appName}>Profile</Text>
          <Text style={styles.appTagline}>Manage your personal information</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gender}
                    style={styles.picker}
                    dropdownIconColor={COLORS.textMuted}
                    mode="dropdown"
                    onValueChange={(itemValue) => setGender(itemValue)}
                  >
                    {genderOptions.map((option) => (
                      <Picker.Item 
                        key={option.value} 
                        label={option.label} 
                        value={option.value} 
                        style={styles.pickerItem}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="175"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="70"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingsCard}>
            <SwitchRow
              label="Offline Mode"
              description="Use the app without internet connection"
              value={isOfflineMode}
              onValueChange={setIsOfflineMode}
            />

            <View style={styles.divider} />

            <SwitchRow
              label="Push Notifications"
              description="Receive updates about your progress"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />

            {notificationsEnabled && (
              <>
                <View style={styles.divider} />
                <View style={styles.pickerSection}>
                  <Text style={styles.inputLabel}>Notification Frequency</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowFrequencyModal(true)}
                  >
                    <Text style={styles.pickerButtonText}>
                      {frequencyOptions.find(option => option.value === notificationFrequency)?.label}
                    </Text>
                    <Text style={styles.pickerArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          
          <View style={styles.securityCard}>
            <View style={styles.securityItem}>
              <View style={styles.securityIcon}>
                <Text style={styles.securityIconText}>🔒</Text>
              </View>
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Data Encryption</Text>
                <Text style={styles.securityDescription}>End-to-end encryption enabled</Text>
              </View>
              <View style={styles.securityStatus}>
                <Text style={styles.activeStatus}>Active</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePrivacyPolicy}
          >
            <Text style={styles.secondaryButtonText}>Review Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
          >
            <Text style={styles.primaryButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogout}
          >
            <Text style={styles.secondaryButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showFrequencyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFrequencyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFrequencyModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Frequency</Text>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  notificationFrequency === option.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setNotificationFrequency(option.value);
                  setShowFrequencyModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  notificationFrequency === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {notificationFrequency === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    paddingTop: isIOS ? 60 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    alignItems: 'center',
  },

  appName: {
    fontSize: 32,
    fontWeight: "800",
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textInverse,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  appTagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
    fontFamily: FONT_FAMILY.medium,
    textAlign: "center",
    letterSpacing: 0.2,
  },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  securityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  inputContainer: {
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.1,
  },

  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
    minHeight: 50,
    textAlignVertical: 'center',
  },

  pickerContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
    minHeight: 50,
    justifyContent: 'center',
  },

  picker: {
    width: '100%',
    height: 50,
    color: COLORS.text,
  },

  pickerItem: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  switchContent: {
    flex: 1,
    marginRight: 16,
  },

  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
    marginBottom: 2,
  },

  switchDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 20,
  },

  pickerSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  pickerButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },

  pickerButtonText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },

  pickerArrow: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },

  modalOptionSelected: {
    backgroundColor: COLORS.primaryLight + '20',
  },

  modalOptionText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text,
  },

  modalOptionTextSelected: {
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.primary,
  },

  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  securityIconText: {
    fontSize: 20,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
    marginBottom: 2,
  },

  securityDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },

  securityStatus: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeStatus: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textInverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  actionSection: {
    marginTop: 8,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textInverse,
    letterSpacing: 0.3,
  },

  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
    letterSpacing: 0.2,
  },

  dangerButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.danger,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },

  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.danger,
    letterSpacing: 0.2,
  },
});

export default ProfileScreen;
