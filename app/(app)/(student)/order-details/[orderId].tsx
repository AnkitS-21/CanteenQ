import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { mockCanteens } from '@/constants/mockData';
import { useOrderStore } from '@/store/orderStore';

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders } = useOrderStore();
  
  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);
  
  const canteen = useMemo(() => {
    if (!order) return null;
    return mockCanteens.find(c => c.id === order.canteenId);
  }, [order]);
  
  if (!order || !canteen) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Order Details' }} />
        <View style={styles.centerContainer}>
          <Text>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusColor = () => {
    switch (order.status) {
      case 'pending':
        return Colors.warning;
      case 'preparing':
        return Colors.primary;
      case 'ready':
        return Colors.success;
      case 'completed':
        return Colors.grayDark;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.grayDark;
    }
  };
  
  const getStatusText = () => {
    switch (order.status) {
      case 'pending':
        return 'Pending';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };
  
  const getTimeRemaining = () => {
    const now = new Date();
    const estimatedTime = new Date(order.estimatedReadyTime);
    
    if (now > estimatedTime || order.status === 'ready' || order.status === 'completed') {
      return null;
    }
    
    const diffMs = estimatedTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    return diffMins > 0 ? `${diffMins} minutes` : 'Any moment now';
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: `Order #${order.id.slice(-4)}` }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor() },
                ]}
              />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
            <Text style={styles.orderTime}>
              Ordered at {formatDate(order.orderTime)}
            </Text>
          </View>
          
          {getTimeRemaining() && (
            <View style={styles.estimateContainer}>
              <Text style={styles.estimateText}>
                Estimated time: {getTimeRemaining()}
              </Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.canteenContainer}>
            <Text style={styles.sectionTitle}>Canteen</Text>
            <Text style={styles.canteenName}>{canteen.name}</Text>
            <Text style={styles.canteenLocation}>{canteen.location}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.itemsContainer}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
          </View>
        </View>
        
        {(order.status === 'ready' || order.status === 'preparing') && (
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>
              {order.status === 'ready'
                ? 'Your order is ready for pickup!'
                : 'Your order is being prepared'}
            </Text>
            <Text style={styles.instructionsText}>
              {order.status === 'ready'
                ? 'Please show this order to the canteen staff to collect your food.'
                : 'Please wait until your order is ready. You will be notified when it\'s time to pick up.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  orderTime: {
    fontSize: 14,
    color: Colors.textLight,
  },
  estimateContainer: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  estimateText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  canteenContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  canteenName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  canteenLocation: {
    fontSize: 14,
    color: Colors.textLight,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textLight,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  instructionsCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});