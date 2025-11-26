import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import auth from "@react-native-firebase/auth";

WebBrowser.maybeCompleteAuthSession();

let promptAsyncGlobal;

export const configureGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "117549545292-kjpnnb6740d3ga8ps6e2jgs90v235mh7.apps.googleusercontent.com",
  });

  promptAsyncGlobal = promptAsync;

  return response;
};

export const signInWithGoogle = async () => {
  const result = await promptAsyncGlobal();

  if (result.type !== "success") 
    throw new Error("Google sign in cancelled");

  const { id_token } = result.params;

  const googleCredential = auth.GoogleAuthProvider.credential(id_token);

  return auth().signInWithCredential(googleCredential);
};
