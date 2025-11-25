import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// --- COIFFEUR LUXURY THEME ---
const COLORS = {
  bg: '#FDFCF8',
  primary: '#1A1A1A',
  gold: '#C6A87C',
  goldLight: '#E5D4B3',
  glass: 'rgba(255, 255, 255, 0.90)',
  border: 'rgba(198, 168, 124, 0.3)',
  inputBg: '#FAFAFA',
  placeholder: '#A1A1AA',
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- 1. Configure Google Sign-In on Mount ---
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID_FROM_FIREBASE_CONSOLE', 
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Coiffeur', 'Please enter your credentials.');
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  // --- 2. Google Sign-In Logic ---
  const handleGoogleLogin = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
      Alert.alert("Google Sign-In Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>COIFFEUR</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Experience luxury at your fingertips.</Text>
        </View>

        <View style={styles.glassCard}>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              placeholder="client@example.com"
              placeholderTextColor={COLORS.placeholder}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••"
              placeholderTextColor={COLORS.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
             <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.goldButton} onPress={handleLogin} activeOpacity={0.9}>
             <Text style={styles.btnText}>SIGN IN</Text>
          </TouchableOpacity>

          {/* --- OR DIVIDER --- */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* --- GOOGLE BUTTON --- */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.9}>
             {/* In a real app, use <Image source={require('./google-icon.png')} /> */}
             <Text style={styles.googleIcon}>G</Text> 
             <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to Coiffeur? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
               <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  glowTop: { position: 'absolute', top: -100, left: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: COLORS.goldLight, opacity: 0.4 },
  glowBottom: { position: 'absolute', bottom: -80, right: -60, width: 320, height: 320, borderRadius: 160, backgroundColor: COLORS.goldLight, opacity: 0.3 },
  content: { width: '100%', paddingHorizontal: 28 },
  header: { marginBottom: 24, alignItems: 'center' },
  brand: { fontSize: 12, fontWeight: '900', letterSpacing: 3, color: COLORS.gold, marginBottom: 10 },
  title: { fontSize: 30, fontWeight: '400', color: COLORS.primary, fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', fontStyle: 'italic' },

  glassCard: {
    backgroundColor: COLORS.glass, borderRadius: 24, padding: 28, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: "#C6A87C", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 25, elevation: 8,
  },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 11, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  input: { backgroundColor: COLORS.inputBg, height: 50, borderRadius: 8, paddingHorizontal: 16, fontSize: 15, color: COLORS.primary, borderWidth: 1, borderColor: '#E5E5E5' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#888', fontSize: 12 },

  goldButton: {
    backgroundColor: COLORS.gold, height: 54, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 14, letterSpacing: 1.5 },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E5E5E5' },
  orText: { marginHorizontal: 10, color: '#999', fontSize: 12 },

  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', height: 54, borderRadius: 8,
    borderWidth: 1, borderColor: '#E5E5E5',
    marginBottom: 10,
  },
  googleIcon: { fontSize: 18, fontWeight: '900', color: '#4285F4', marginRight: 12 }, 
  googleText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },

  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#666', fontSize: 14 },
  footerLink: { color: COLORS.gold, fontWeight: '700', fontSize: 14 },
});
