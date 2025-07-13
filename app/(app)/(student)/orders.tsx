import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

import EmptyState from '@/components/EmptyState';
import OrderCard from '@/components/OrderCard';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  
  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders
      .filter(order => order.userId === user.id)
      .sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());
  }, [orders, user]);
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {userOrders.length > 0 ? (
        <FlatList
          data={userOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => handleOrderPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No orders yet"
          message="Your order history will appear here"
          buttonTitle="Browse Canteens"
          onButtonPress={() => router.push('/')}
          icon={<Feather name="clipboard" size={48} color={Colors.grayDark} />}
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
});
