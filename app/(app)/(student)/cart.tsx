import { Stack, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import FoodCard from '@/components/FoodCard';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';

export default function CartScreen() {
  const router = useRouter();
  const { items, getTotalAmount, clearCart, canteenId } = useCartStore();
  const { placeOrder, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  
  const totalAmount = getTotalAmount();
  
  const handlePlaceOrder = async () => {
    if (!user || !canteenId) return;
    
    try {
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      
      const order = await placeOrder({
        userId: user.id,
        canteenId,
        items: orderItems,
        totalAmount,
      });
      
      clearCart();
      router.push(`/order-details/${order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Your Cart' }} />
      
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FoodCard
                item={item}
                showControls
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{totalAmount}</Text>
            </View>
            
            <Button
              title="Place Order"
              onPress={handlePlaceOrder}
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            />
          </View>
        </>
      ) : (
        <EmptyState
          title="Your cart is empty"
          message="Add items from the menu to place an order"
          buttonTitle="Browse Menu"
          onButtonPress={() => router.back()}
          icon={<Feather name="shopping-bag" size={48} color={Colors.grayDark} />}
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
  listContent: {
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
