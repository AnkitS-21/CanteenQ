import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { mockFoodCategories } from '@/constants/mockData';
import { useAuthStore } from '@/store/authStore';
import { useMenuStore } from '@/store/menuStore';

export default function AddItemScreen() {
  const router = useRouter();
  const { addFoodItem } = useMenuStore();
  const { user } = useAuthStore();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60');
  const [category, setCategory] = useState(mockFoodCategories[1]); // Default to Breakfast
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    description?: string;
    image?: string;
  }>({});
  
  const validate = () => {
    const newErrors: {
      name?: string;
      price?: string;
      description?: string;
      image?: string;
    } = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!description) {
      newErrors.description = 'Description is required';
    }
    
    if (!image) {
      newErrors.image = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddItem = () => {
    if (!validate() || !user?.canteenId) return;
    
    addFoodItem({
      name,
      price: Number(price),
      description,
      image,
      category,
      canteenId: user.canteenId,
      available: true,
    });
    
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Add Menu Item' }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Input
          label="Item Name"
          placeholder="Enter item name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        
        <Input
          label="Price (₹)"
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          error={errors.price}
        />
        
        <Input
          label="Description"
          placeholder="Enter item description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          error={errors.description}
        />
        
        <Input
          label="Image URL"
          placeholder="Enter image URL"
          value={image}
          onChangeText={setImage}
          error={errors.image}
        />
        
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesContainer}>
          {mockFoodCategories.slice(1).map((cat) => (
            <Text
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.selectedCategoryButton,
              ]}
              onPress={() => setCategory(cat)}
            >
              {cat}
            </Text>
          ))}
        </View>
        
        <Button
          title="Add Item"
          onPress={handleAddItem}
          variant="primary"
          size="large"
          fullWidth
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.text,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
    color: Colors.white,
  },
  button: {
    marginTop: 16,
  },
});