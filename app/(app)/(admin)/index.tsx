import { Feather } from '@expo/vector-icons'; // <-- replaced lucide with Feather
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import OrderCard from '@/components/OrderCard';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';

export default function AdminOrdersScreen() {
  const router = useRouter();
  const { orders, updateOrderStatus } = useOrderStore();
  const { user } = useAuthStore();
  
  const [activeFilter, setActiveFilter] = useState<string>('active');
  
  const canteenOrders = useMemo(() => {
    if (!user?.canteenId) return [];
    
    const filteredOrders = orders.filter(order => order.canteenId === user.canteenId);
    
    if (activeFilter === 'active') {
      return filteredOrders.filter(
        order => ['pending', 'preparing', 'ready'].includes(order.status)
      ).sort((a, b) => {
        // Sort by status priority: pending > preparing > ready
        const statusPriority = { pending: 0, preparing: 1, ready: 2 };
        const statusDiff = statusPriority[a.status as keyof typeof statusPriority] - 
                          statusPriority[b.status as keyof typeof statusPriority];
        
        if (statusDiff !== 0) return statusDiff;
        
        // If same status, sort by order time (newest first)
        return new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime();
      });
    } else {
      return filteredOrders.filter(
        order => ['completed', 'cancelled'].includes(order.status)
      ).sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());
    }
  }, [orders, user, activeFilter]);
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };
  
  const handleUpdateStatus = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Orders</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <Text
            style={[
              styles.filterButton,
              activeFilter === 'active' && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter('active')}
          >
            Active Orders
          </Text>
          <Text
            style={[
              styles.filterButton,
              activeFilter === 'completed' && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter('completed')}
          >
            Completed Orders
          </Text>
        </View>
      </View>
      
      {canteenOrders.length > 0 ? (
        <FlatList
          data={canteenOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => handleOrderPress(item.id)}
              isAdmin
              onUpdateStatus={(status) => handleUpdateStatus(item.id, status)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title={`No ${activeFilter} orders`}
          message={
            activeFilter === 'active'
              ? "You don't have any active orders at the moment"
              : "You don't have any completed orders yet"
          }
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    textAlign: 'center',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButton: {
    backgroundColor: Colors.white,
    color: Colors.primary,
  },
  listContent: {
    padding: 20,
  },
});
