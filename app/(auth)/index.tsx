import { Redirect, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Handle redirect if user is already authenticated
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Redirect href="/(app)/(admin)" />;
    } else {
      return <Redirect href="/(app)/(student)" />;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Q</Text>
          </View>
          <Text style={styles.appName}>CanteenQ</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60' }}
            style={styles.image}
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Skip the Queue, Enjoy Your Food</Text>
          <Text style={styles.subtitle}>
            Pre-order your meals from campus canteens and save time waiting in line
          </Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => router.push('/(auth)/login')}
          variant="primary"
          size="large"
          fullWidth
          style={styles.button}
        />
        <Button
          title="Register"
          onPress={() => router.push('/(auth)/register')}
          variant="outline"
          size="large"
          fullWidth
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.white,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 24,
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
});