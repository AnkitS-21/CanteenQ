import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if user is already authenticated
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Redirect href="/(app)/(admin)" />;
    } else {
      return <Redirect href="/(app)/(student)" />;
    }
  }

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    const success = await login(email, password);
    
    if (!success) {
      setErrors({
        email: 'Invalid email or password',
      });
    }
    // Navigation will be handled by the redirect above
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>
      
      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          leftIcon={<Feather name="mail" size={20} color={Colors.grayDark} />}
        />
        
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          leftIcon={<Feather name="lock" size={20} color={Colors.grayDark} />}
        />
        
        <Button
          title="Login"
          onPress={handleLogin}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          style={styles.button}
        />
        
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Button
            title="Register"
            onPress={() => router.push('/(auth)/register')}
            variant="text"
            size="small"
          />
        </View>
      </View>
      
      <View style={styles.demoAccountsContainer}>
        <Text style={styles.demoAccountsTitle}>Demo Accounts:</Text>
        <Text style={styles.demoAccount}>Admin: admin@canteenq.com / password</Text>
        <Text style={styles.demoAccount}>Student: student@example.com / password</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  demoAccountsContainer: {
    marginTop: 'auto',
    padding: 16,
    backgroundColor: Colors.gray,
    borderRadius: 8,
  },
  demoAccountsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  demoAccount: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
});
