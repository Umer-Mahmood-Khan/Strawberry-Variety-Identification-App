import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from '@firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

const firebaseConfig = {
  apiKey: "AIzaSyBX5fmw91abLEpSPoyFFxmEBkuG5kxPXso",
  authDomain: "berryscan-c511a.firebaseapp.com",
  databaseURL: "https://berryscan-c511a-default-rtdb.firebaseio.com",
  projectId: "berryscan-c511a",
  storageBucket: "berryscan-c511a.appspot.com",
  messagingSenderId: "531425893147",
  appId: "1:531425893147:web:a41a4e43a70fc1f1b751be"
};

const app = initializeApp(firebaseConfig);

interface AuthScreenProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  isPasswordVisible: boolean;
  setIsPasswordVisible: (visible: boolean) => void;
  isConfirmPasswordVisible: boolean;
  setIsConfirmPasswordVisible: (visible: boolean) => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  handleAuthentication: () => void;
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    specialChar: boolean;
  };
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  isConfirmPasswordVisible,
  setIsConfirmPasswordVisible,
  isLogin,
  setIsLogin,
  handleAuthentication,
  requirements
}) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <FontAwesome name={isPasswordVisible ? 'eye-slash' : 'eye'} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      {!isLogin && (
        <>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
              <FontAwesome name={isConfirmPasswordVisible ? 'eye-slash' : 'eye'} size={24} color="grey" />
            </TouchableOpacity>
          </View>
          <View style={styles.requirementsContainer}>
            <View style={styles.requirement}>
              <FontAwesome
                name={requirements.length ? 'check-circle' : 'times-circle'}
                size={24}
                color={requirements.length ? 'green' : 'red'}
              />
              <Text style={styles.requirementText}>Minimum 8 characters</Text>
            </View>
            <View style={styles.requirement}>
              <FontAwesome
                name={requirements.lowercase ? 'check-circle' : 'times-circle'}
                size={24}
                color={requirements.lowercase ? 'green' : 'red'}
              />
              <Text style={styles.requirementText}>At least one lowercase letter</Text>
            </View>
            <View style={styles.requirement}>
              <FontAwesome
                name={requirements.uppercase ? 'check-circle' : 'times-circle'}
                size={24}
                color={requirements.uppercase ? 'green' : 'red'}
              />
              <Text style={styles.requirementText}>At least one uppercase letter</Text>
            </View>
            <View style={styles.requirement}>
              <FontAwesome
                name={requirements.specialChar ? 'check-circle' : 'times-circle'}
                size={24}
                color={requirements.specialChar ? 'green' : 'red'}
              />
              <Text style={styles.requirementText}>At least one special character</Text>
            </View>
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
}

interface AuthenticatedScreenProps {
  user: User;
  handleAuthentication: () => void;
}

const AuthenticatedScreen: React.FC<AuthenticatedScreenProps> = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState<User | null>(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [requirements, setRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
  });

  const auth = getAuth(app);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          if (!validateEmail(email)) {
            showToast('Invalid email address');
            return;
          }

          if (password !== confirmPassword) {
            showToast('Passwords do not match');
            return;
          }

          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Authentication error:', error.message);
        showToast(error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setRequirements({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: '#e74c3c',
      textColor: '#fff',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={handlePasswordChange}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
          isConfirmPasswordVisible={isConfirmPasswordVisible}
          setIsConfirmPasswordVisible={setIsConfirmPasswordVisible}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          requirements={requirements}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  requirementsContainer: {
    marginBottom: 16,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    color: '#555',
  },
});

export default App;
