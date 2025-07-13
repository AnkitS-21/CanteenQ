import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '@/constants/colors';
import { Order } from '@/types';
import Button from './Button';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  isAdmin?: boolean;
  onUpdateStatus?: (status: string) => void;
}

export default function OrderCard({
  order,
  onPress,
  isAdmin = false,
  onUpdateStatus,
}: OrderCardProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const estimatedTime = new Date(order.estimatedReadyTime);

    if (now > estimatedTime || order.status === 'ready' || order.status === 'completed') {
      return null;
    }

    const diffMs = estimatedTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);

    return diffMins > 0 ? `${diffMins} min` : 'Any moment now';
  };

  const renderAdminActions = () => {
    if (!isAdmin) return null;

    switch (order.status) {
      case 'pending':
        return (
          <Button
            title="Start Preparing"
            onPress={() => onUpdateStatus && onUpdateStatus('preparing')}
            variant="primary"
            size="small"
          />
        );
      case 'preparing':
        return (
          <Button
            title="Mark as Ready"
            onPress={() => onUpdateStatus && onUpdateStatus('ready')}
            variant="primary"
            size="small"
          />
        );
      case 'ready':
        return (
          <Button
            title="Mark as Completed"
            onPress={() => onUpdateStatus && onUpdateStatus('completed')}
            variant="primary"
            size="small"
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Order #{order.id.slice(-4)}</Text>
          <Text style={styles.orderTime}>
            Ordered at {formatDate(order.orderTime)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>

        {getTimeRemaining() && (
          <View style={styles.timeContainer}>
            <Feather name="clock" size={14} color={Colors.primary} />
            <Text style={styles.timeText}>{getTimeRemaining()}</Text>
          </View>
        )}
      </View>

      {renderAdminActions() && (
        <View style={styles.actionsContainer}>
          {renderAdminActions()}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  orderTime: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionsContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
});
