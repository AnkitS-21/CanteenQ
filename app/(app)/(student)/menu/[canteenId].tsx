import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

import EmptyState from '@/components/EmptyState';
import FoodCard from '@/components/FoodCard';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { mockCanteens, mockFoodCategories } from '@/constants/mockData';
import { useCartStore } from '@/store/cartStore';
import { useMenuStore } from '@/store/menuStore';

export default function MenuScreen() {
  const { canteenId } = useLocalSearchParams<{ canteenId: string }>();
  const router = useRouter();
  const { getFoodItems } = useMenuStore();
  const { items, getTotalItems } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const canteen = mockCanteens.find(c => c.id === canteenId);
  const foodItems = getFoodItems(canteenId || '');

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foodItems, searchQuery, selectedCategory]);

  const cartItemCount = getTotalItems();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.canteenName}>{canteen?.name}</Text>
        <Text style={styles.canteenLocation}>{canteen?.location}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search menu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Feather name="search" size={20} color={Colors.grayDark} />}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={mockFoodCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item && styles.selectedCategoryButtonText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              showControls
            />
          )}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No items found"
          message={`We couldn't find any ${selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'items'} matching your search.`}
        />
      )}

      {cartItemCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
        >
          <Feather name="shopping-cart" size={24} color={Colors.white} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  canteenName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  canteenLocation: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedCategoryButtonText: {
    color: Colors.white,
  },
  menuList: {
    padding: 20,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
