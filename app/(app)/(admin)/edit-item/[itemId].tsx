import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { mockFoodCategories } from '@/constants/mockData';
import { useMenuStore } from '@/store/menuStore';

export default function EditItemScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const router = useRouter();
  const { foodItems, updateFoodItem } = useMenuStore();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(true);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    description?: string;
    image?: string;
  }>({});
  
  useEffect(() => {
    const item = foodItems.find(item => item.id === itemId);
    if (item) {
      setName(item.name);
      setPrice(item.price.toString());
      setDescription(item.description);
      setImage(item.image);
      setCategory(item.category);
      setAvailable(item.available);
    }
  }, [itemId, foodItems]);
  
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
  
  const handleUpdateItem = () => {
    if (!validate() || !itemId) return;
    
    updateFoodItem(itemId, {
      name,
      price: Number(price),
      description,
      image,
      category,
      available,
    });
    
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Edit Menu Item' }} />
      
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
        
        <Text style={styles.label}>Availability</Text>
        <View style={styles.availabilityContainer}>
          <Text
            style={[
              styles.availabilityButton,
              available && styles.selectedAvailabilityButton,
            ]}
            onPress={() => setAvailable(true)}
          >
            Available
          </Text>
          <Text
            style={[
              styles.availabilityButton,
              !available && styles.unavailableButton,
            ]}
            onPress={() => setAvailable(false)}
          >
            Unavailable
          </Text>
        </View>
        
        <Button
          title="Update Item"
          onPress={handleUpdateItem}
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
  availabilityContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  availabilityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedAvailabilityButton: {
    backgroundColor: Colors.success,
    color: Colors.white,
  },
  unavailableButton: {
    backgroundColor: Colors.error,
    color: Colors.white,
  },
  button: {
    marginTop: 16,
  },
});