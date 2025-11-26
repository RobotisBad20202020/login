import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '117549545292-kjpnnb6740d3ga8ps6e2jgs90v235mh7.apps.googleusercontent.com',
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          // You can remove the purple style here since we are hiding the headers
          headerShown: false 
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          // This explicitly hides the header for the Home screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
