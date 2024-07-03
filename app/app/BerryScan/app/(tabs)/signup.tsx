import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Signin from './Signin';
import SignupForm from './Signup_Form'; // Adjust the path as needed

const Signup: React.FC = () => {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  const handleSignupWithEmail = () => {
    setShowSignupForm(true); // Set state to show SignupForm
  };

  const handleGoogleLogin = () => {
    console.log('Google icon clicked');
  };

  const handleSignIn = () => {
    setShowSignin(true); // Set state to show Signin component
  };

  if (showSignupForm) {
    return <SignupForm />;
  }

  if (showSignin) {
    return <Signin />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.signupText}>Signup to continue</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleIcon}>
            <Text>Sign up with Google</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>or</Text>
          <TouchableOpacity onPress={handleSignupWithEmail} style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Signup with email</Text>
          </TouchableOpacity>
          <Text style={styles.haveAccountText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign in</Text>
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
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  googleIcon: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#373737',
    fontSize: 24,
    marginBottom: 10,
  },
  signupText: {
    color: '#373737',
    fontSize: 24,
  },
  orText: {
    color: '#373737',
    fontSize: 18,
    marginVertical: 10,
  },
  signupButton: {
    backgroundColor: '#008253',
    width: 200,
    height: 40,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  haveAccountText: {
    color: '#373737',
    fontSize: 14,
    marginTop: 20,
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    width: 200,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: '#008253',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Signup;
