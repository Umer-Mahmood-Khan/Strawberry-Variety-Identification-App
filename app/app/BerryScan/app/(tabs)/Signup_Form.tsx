import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firebaseConfig } from './_layout';
import Signup from './signup';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignupForm: React.FC = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [conditionsMet, setConditionsMet] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
  });
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false); // State to track if email is verified
  const [showSignup, setShowSignup] = useState(false); // State to control showing the Signup component

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsEmailVerified(user.emailVerified);
      } else {
        setIsEmailVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const togglePasswordVisibility = () => {
    setHidePassword((prev) => !prev);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  const validatePassword = (value: string) => {
    const conditions = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      digit: /\d/.test(value),
    };
    setConditionsMet(conditions);
  };

  const isPasswordValid = () => {
    return (
      conditionsMet.length &&
      conditionsMet.uppercase &&
      conditionsMet.lowercase &&
      conditionsMet.digit &&
      password === confirmPassword
    );
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsExistingUser(false);
  };

  const validateEmail = async (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');

      try {
        const providers = await fetchSignInMethodsForEmail(auth, value);
        setIsExistingUser(providers && providers.length > 0);
      } catch (error: any) {
        console.error('Error checking existing user:', error.message);
        setIsExistingUser(false);
      }
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        Alert.alert(
          'Verification Email Sent',
          'A verification email has been sent to your email address. Please check your inbox.'
        );
      } else {
        console.error('No user is signed in');
        Alert.alert('Error', 'No user is signed in');
      }
    } catch (error: any) {
      console.error('Error sending verification email:', error.message);
      Alert.alert('Error', 'Failed to send verification email');
    }
  };

  const handleContinuePress = async () => {
    if (isExistingUser) {
      Alert.alert('Validation Error', 'This email is already registered. Please use a different email.');
    } else if (!isPasswordValid() || emailError) {
      Alert.alert('Validation Error', 'Please fix the highlighted errors before continuing.');
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendVerificationEmail();

        Alert.alert(
          'Sign Up Success',
          `Congratulations! You have signed up successfully as ${user.email}. Please check your email to verify.`
        );
      } catch (error: any) {
        console.error('Error signing up:', error.message);
        Alert.alert('Sign Up Error', `Failed to sign up: ${error.message}`);
      }
    }
  };

  const handleGoToSignup = () => {
    setShowSignup(true);
  };

  if (showSignup) {
    return <Signup />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <TouchableOpacity onPress={handleGoToSignup} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#008253" />
        </TouchableOpacity>
        <Text style={styles.title}>Sign up</Text>
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
          {isExistingUser ? (
            <Text style={styles.errorText}>This email is already registered. Please use a different email.</Text>
          ) : null}
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.inputInner}
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              secureTextEntry={hidePassword}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
              <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.inputInner}
              placeholder="Confirm Password"
              placeholderTextColor="#FFFFFF"
              secureTextEntry={hidePassword}
              onChangeText={handleConfirmPasswordChange}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
              <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.conditionsContainer}>
            <Text style={[styles.conditionText, conditionsMet.length ? styles.conditionMet : styles.conditionNotMet]}>
              Password must be at least 8 characters long
            </Text>
            <Text style={[styles.conditionText, conditionsMet.uppercase ? styles.conditionMet : styles.conditionNotMet]}>
              Password must contain at least one uppercase letter
            </Text>
            <Text style={[styles.conditionText, conditionsMet.lowercase ? styles.conditionMet : styles.conditionNotMet]}>
              Password must contain at least one lowercase letter
            </Text>
            <Text style={[styles.conditionText, conditionsMet.digit ? styles.conditionMet : styles.conditionNotMet]}>
              Password must contain at least one digit
            </Text>
            <Text
              style={[styles.conditionText, password === confirmPassword ? styles.conditionMet : styles.conditionNotMet]}
            >
              Passwords must match
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinuePress}
          disabled={!isPasswordValid() || !!emailError}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2DD', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
  },
  block: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 10,
    top: 10,
  },
  title: {
    color: '#373737',
    fontSize: 24,
    marginBottom: 40,
    marginTop: 40,
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
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  inputInner: {
    flex: 1,
    backgroundColor: '#CFD1D4',
    color: '#FFFFFF',
    fontSize: 16,
    borderRadius: 5,
    paddingHorizontal: 20,
    height: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  conditionsContainer: {
    marginBottom: 20,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  conditionMet: {
    color: '#008253',
  },
  conditionNotMet: {
    color: '#FF0000',
  },
  continueButton: {
    backgroundColor: '#008253',
    width: 200,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SignupForm;
