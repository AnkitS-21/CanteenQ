import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';

export default function AdminOrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders, updateOrderStatus } = useOrderStore();
  
  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);
  
  if (!order) {
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
  
  const handleUpdateStatus = (status: string) => {
    updateOrderStatus(order.id, status as any);
  };
  
  const renderActionButtons = () => {
    switch (order.status) {
      case 'pending':
        return (
          <Button
            title="Start Preparing"
            onPress={() => handleUpdateStatus('preparing')}
            variant="primary"
            fullWidth
          />
        );
      case 'preparing':
        return (
          <Button
            title="Mark as Ready"
            onPress={() => handleUpdateStatus('ready')}
            variant="primary"
            fullWidth
          />
        );
      case 'ready':
        return (
          <Button
            title="Mark as Completed"
            onPress={() => handleUpdateStatus('completed')}
            variant="primary"
            fullWidth
          />
        );
      default:
        return null;
    }
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
        
        {renderActionButtons() && (
          <View style={styles.actionsContainer}>
            {renderActionButtons()}
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
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
  actionsContainer: {
    marginBottom: 20,
  },
});