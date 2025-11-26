import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Create user with Firebase
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update user profile with username
      await userCredential.user.updateProfile({
        displayName: username,
      });

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Home') }
      ]);
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'This email is already registered. Please login instead.';
      else if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address format.';
      else if (error.code === 'auth/weak-password') errorMessage = 'Password is too weak. Use a stronger password.';
      
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.replace('Home');
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
             <View style={styles.decorativeCircle} />
            <Text style={styles.brandLabel}>COIFFEUR</Text>
            <Text style={styles.title}>Join the Elite</Text>
            <Text style={styles.subtitle}>Your exclusive journey begins now.</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#A0A0A0"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="client@example.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>SET PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Min. 6 characters"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
               {/* Optional: Confirm Password could be removed for cleaner UI if preferred, but keeping for safety */}
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                placeholder="Confirm Password"
                placeholderTextColor="#A0A0A0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color="#C5A065" style={styles.loader} />
            ) : (
              <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupButtonText}>BECOME A MEMBER</Text>
              </TouchableOpacity>
            )}

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already a member? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Cream background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -150,
    left: -100, // Positioned differently than login for variety
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#F0EBE0',
    opacity: 0.5,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 20,
  },
  brandLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C5A065',
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 101, 0.1)',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  loader: {
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: '#1A1A1A', // Dark button for "Become a Member" creates nice contrast
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonText: {
    color: '#C5A065', // Gold text on black button
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 12,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#C5A065',
    fontWeight: '700',
  },
});
