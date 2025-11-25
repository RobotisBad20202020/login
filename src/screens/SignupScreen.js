import React, { useState } from 'react';
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

const COLORS = {
  bg: '#FDFCF8',
  primary: '#1A1A1A',
  gold: '#C6A87C',
  goldLight: '#E5D4B3',
  glass: 'rgba(255, 255, 255, 0.95)',
  border: 'rgba(198, 168, 124, 0.3)',
  inputBg: '#FAFAFA',
  placeholder: '#A1A1AA',
};

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !name) return Alert.alert('Coiffeur', 'Please complete your profile.');
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: name });
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  // --- Google Sign-In Logic ---
  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Create user and then (optional) update profile name if needed
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Note: Google Sign-In automatically handles account creation if it doesn't exist
    } catch (error) {
      console.error(error);
      Alert.alert("Google Sign-In Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <View style={styles.glowCenter} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>COIFFEUR</Text>
          <Text style={styles.title}>Join the Elite</Text>
          <Text style={styles.subtitle}>Your exclusive journey begins now.</Text>
        </View>

        <View style={styles.glassCard}>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="John Doe"
              placeholderTextColor={COLORS.placeholder}
              value={name}
              onChangeText={setName}
            />
          </View>

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
            <Text style={styles.label}>Set Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Min. 8 characters"
              placeholderTextColor={COLORS.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.goldButton} onPress={handleSignup} activeOpacity={0.9}>
             <Text style={styles.btnText}>BECOME A MEMBER</Text>
          </TouchableOpacity>

          {/* --- OR DIVIDER --- */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* --- GOOGLE BUTTON --- */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup} activeOpacity={0.9}>
             <Text style={styles.googleIcon}>G</Text> 
             <Text style={styles.googleText}>Sign up with Google</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already a member? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
               <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  glowCenter: { position: 'absolute', top: '20%', right: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: COLORS.goldLight, opacity: 0.25 },
  content: { width: '100%', paddingHorizontal: 28 },
  header: { marginBottom: 20, alignItems: 'center' },
  brand: { fontSize: 12, fontWeight: '900', letterSpacing: 3, color: COLORS.gold, marginBottom: 10 },
  title: { fontSize: 30, fontWeight: '400', color: COLORS.primary, fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', fontStyle: 'italic' },

  glassCard: {
    backgroundColor: COLORS.glass, borderRadius: 24, padding: 28, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: "#C6A87C", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 25, elevation: 8,
  },
  inputContainer: { marginBottom: 14 },
  label: { fontSize: 11, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  input: { backgroundColor: COLORS.inputBg, height: 50, borderRadius: 8, paddingHorizontal: 16, fontSize: 15, color: COLORS.primary, borderWidth: 1, borderColor: '#E5E5E5' },

  goldButton: {
    backgroundColor: COLORS.primary, height: 54, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  btnText: { color: COLORS.gold, fontWeight: '700', fontSize: 14, letterSpacing: 1.5 },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: '#E5E5E5' },
  orText: { marginHorizontal: 10, color: '#999', fontSize: 12 },

  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', height: 54, borderRadius: 8,
    borderWidth: 1, borderColor: '#E5E5E5',
  },
  googleIcon: { fontSize: 18, fontWeight: '900', color: '#4285F4', marginRight: 12 },
  googleText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },

  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  footerText: { color: '#666', fontSize: 14 },
  footerLink: { color: COLORS.gold, fontWeight: '700', fontSize: 14 },
});
