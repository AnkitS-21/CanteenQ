import { Feather } from '@expo/vector-icons'; // <-- Replaced lucide with Feather
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import FoodCard from '@/components/FoodCard';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { mockFoodCategories } from '@/constants/mockData';
import { useAuthStore } from '@/store/authStore';
import { useMenuStore } from '@/store/menuStore';

export default function AdminMenuScreen() {
  const router = useRouter();
  const { getFoodItems, toggleAvailability, deleteFoodItem } = useMenuStore();
  const { user } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const menuItems = useMemo(() => {
    if (!user?.canteenId) return [];
    return getFoodItems(user.canteenId);
  }, [user, getFoodItems]);
  
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);
  
  const handleAddItem = () => {
    router.push('/add-item');
  };
  
  const handleEditItem = (itemId: string) => {
    router.push(`/edit-item/${itemId}`);
  };
  
  const handleDeleteItem = (itemId: string) => {
    deleteFoodItem(itemId);
  };
  
  const handleToggleAvailability = (itemId: string) => {
    toggleAvailability(itemId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Menu</Text>
        <Button
          title="Add Item"
          onPress={handleAddItem}
          variant="primary"
          icon={<Feather name="plus" size={18} color={Colors.white} />} // <-- Updated icon
        />
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Feather name="search" size={20} color={Colors.grayDark} />} // <-- Updated icon
          style={styles.searchInput}
        />
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={mockFoodCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Text
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              {item}
            </Text>
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
              isAdmin
              onToggleAvailability={() => handleToggleAvailability(item.id)}
              onEdit={() => handleEditItem(item.id)}
              onDelete={() => handleDeleteItem(item.id)}
            />
          )}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No items found"
          message={
            menuItems.length === 0
              ? "You haven't added any menu items yet"
              : `No ${selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'items'} matching your search`
          }
          buttonTitle={menuItems.length === 0 ? "Add First Item" : undefined}
          onButtonPress={menuItems.length === 0 ? handleAddItem : undefined}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
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
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
    color: Colors.white,
  },
  menuList: {
    padding: 20,
  },
});
