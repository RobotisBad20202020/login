import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // Copy this from Firebase Console > Authentication > Sign-in method > Google > Web SDK config
    webClientId: '117549545292-kjpnnb6740d3ga8ps6e2jgs90v235mh7.apps.googleusercontent.com', 
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { data } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};
