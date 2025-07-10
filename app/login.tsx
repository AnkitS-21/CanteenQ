import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (role === 'admin') {
      // Hardcoded admin credentials for testing
      const adminEmail = 'admin@canteen.com';
      const adminPassword = 'admin123';

      if (email === adminEmail && password === adminPassword) {
        router.push('/admin');
      } else {
        Alert.alert('Invalid admin credentials');
      }
    } else {
      // For student login - replace with real authentication
      console.log('Logging in as student:', email);
      router.push('/register'); // create this page later for student dashboard
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Button
          title="Login as Student"
          onPress={() => setRole('student')}
          color={role === 'student' ? 'blue' : 'gray'}
        />
        <Button
          title="Login as Admin"
          onPress={() => setRole('admin')}
          color={role === 'admin' ? 'blue' : 'gray'}
        />
      </View>

      <TextInput
        placeholder={role === 'student' ? "Student Email" : "Admin Email"}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} />

      {role === 'student' && (
        <Link href="/register" style={styles.link}>
          Don't have an account? Register
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { marginTop: 10, color: 'blue', textAlign: 'center' },
});
