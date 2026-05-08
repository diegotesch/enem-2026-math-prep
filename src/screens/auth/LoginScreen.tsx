import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
    }

    // If there are errors, don't submit
    if (emailError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      // Call API /api/auth/login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token via AuthContext
      login(data.token, data.user || { email });

      // Navigate to Home
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ENEM 2026 Math Prep</Text>
      <Text style={styles.subtitle}>Login to your account</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>
      
      <Button
        title="Entrar"
        onPress={handleLogin}
        color="#841584"
        disabled={loading || !email || !password || !!emailError || !!passwordError}
      />
      
      {loading && <Text style={styles.logging}>Logging in...</Text>}
      
      <View style={styles.bottomLinks}>
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Don't have an account? Register
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 15,
  },
  bottomLinks: {
    marginTop: 20,
  },
  link: {
    color: '#841584',
    textDecorationLine: 'underline',
  },
  logging: {
    marginTop: 10,
    color: '#666',
  },
});