import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

import CanteenCard from '@/components/CanteenCard';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { mockCanteens } from '@/constants/mockData';
import { useAuthStore } from '@/store/authStore';

export default function StudentHomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCanteens = mockCanteens.filter(canteen =>
    canteen.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCanteenPress = (canteenId: string) => {
    router.push(`/menu/${canteenId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.subtitle}>What would you like to eat today?</Text>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search canteens..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Feather name="search" size={20} color={Colors.grayDark} />}
          style={styles.searchInput}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Available Canteens</Text>
      
      <FlatList
        data={filteredCanteens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CanteenCard
            canteen={item}
            onPress={() => handleCanteenPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
});
