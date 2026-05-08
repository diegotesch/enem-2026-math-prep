import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ENEM 2026 Math Prep' }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}