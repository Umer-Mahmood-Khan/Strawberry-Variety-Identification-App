import { initializeApp } from 'firebase/app';
import { fetchSignInMethodsForEmail, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Signin from './Signin'; // Adjust path as per your project structure
import { firebaseConfig } from './_layout'; // Adjust path as per your project structure

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [showSignin, setShowSignin] = useState(false); // State to toggle back to Signin

  const auth = getAuth(app);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError('');
  };

  const validateEmail = async () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');

      try {
        setLoading(true); // Set loading state while checking email existence
        // Check if the email exists in Firebase authentication
        const providers = await fetchSignInMethodsForEmail(auth, email);

        if (providers.length === 0) {
          setIsEmailValid(false);
          setEmailError('This email is not registered. Please enter a registered email.');
        } else {
          setIsEmailValid(true);
        }
      } catch (error: any) {
        console.error('Error checking email existence:', error.message);
        setIsEmailValid(false);
        setEmailError('Failed to check email existence. Please try again later.');
      } finally {
        setLoading(false); // Clear loading state regardless of success or failure
      }
    }
  };

  const handleSendPress = async () => {
    if (!isEmailValid) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
    } else {
      try {
        setLoading(true); // Set loading state while sending password reset email
        // Send password reset email
        await sendPasswordResetEmail(auth, email);
        Alert.alert('Password Reset Email Sent', `A password reset email has been sent to ${email}. Please check your inbox.`);
      } catch (error: any) {
        console.error('Error sending password reset email:', error.message);
        Alert.alert('Error', 'Failed to send password reset email. Please try again later.');
      } finally {
        setLoading(false); // Clear loading state regardless of success or failure
      }
    }
  };

  const handleBackToSignin = () => {
    setShowSignin(true); // Set state to true to render Signin component
  };

  if (showSignin) {
    return <Signin />; // Render Signin component if showSignin is true
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <TouchableOpacity onPress={handleBackToSignin} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.subtitle}>Reset by providing your email address</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#FFFFFF"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleEmailChange}
              onBlur={validateEmail}
              editable={!loading} // Disable input field while loading
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          <TouchableOpacity
            style={[styles.sendButton, { opacity: loading ? 0.5 : 1 }]} // Dim send button when loading
            onPress={handleSendPress}
            disabled={!email.trim() || loading} // Disable send button while loading or email is empty
          >
            <Text style={styles.sendButtonText}>{loading ? 'Sending...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#FFFFFF', // White background for the box
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
  title: {
    fontSize: 24,
    color: '#373737',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#373737',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#CFD1D4',
    color: '#373737',
    fontSize: 16,
    borderRadius: 5,
    paddingHorizontal: 20,
    height: 40,
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
  sendButton: {
    backgroundColor: '#008253',
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    color: '#008253',
    fontSize: 16,
  },
});

export default ForgotPassword;
