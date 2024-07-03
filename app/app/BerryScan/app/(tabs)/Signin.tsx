import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firebaseConfig } from './_layout'; // Adjust path as per your project structure
import ForgotPassword from './forgot_password'; // Adjust path as per your project structure

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const validateEmail = (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSigninPress = async () => {
    validateEmail(email);
    if (emailError || !email) {
      Alert.alert('Validation Error', 'Please enter a valid email.');
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password');
      Alert.alert('Validation Error', 'Please enter your password.');
      return;
    }
    setPasswordError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Login Successful', `Welcome back ${user.email}!`);
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      Alert.alert('Login Error', 'Invalid email or password. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  if (showForgotPassword) {
    return <ForgotPassword />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Sign in to continue!</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#FFFFFF"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleEmailChange}
              onBlur={() => validateEmail(email)}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signinButton} onPress={handleSigninPress}>
            <Text style={styles.signinButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: '#373737',
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    color: '#373737',
    fontSize: 16,
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#CFD1D4',
    color: '#373737',
    fontSize: 16,
    borderRadius: 5,
    paddingHorizontal: 20,
    height: 40,
    width: '100%',
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#008253',
    fontSize: 14,
    marginBottom: 20,
  },
  signinButton: {
    backgroundColor: '#008253',
    width: 200,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Signin;
