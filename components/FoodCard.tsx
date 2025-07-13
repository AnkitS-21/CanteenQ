import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { FoodItem } from '@/types';

interface FoodCardProps {
  item: FoodItem;
  onPress?: () => void;
  showControls?: boolean;
  isAdmin?: boolean;
  onToggleAvailability?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FoodCard({
  item,
  onPress,
  showControls = false,
  isAdmin = false,
  onToggleAvailability,
  onEdit,
  onDelete,
}: FoodCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  
  const cartItem = items.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    if (quantity === 0) {
      addItem(item);
    } else {
      updateQuantity(item.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !item.available && styles.unavailableContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!item.available && !isAdmin}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        {!item.available && !isAdmin && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Currently Unavailable</Text>
          </View>
        )}
        
        {isAdmin ? (
          <View style={styles.adminControls}>
            <TouchableOpacity
              style={[
                styles.availabilityButton,
                item.available ? styles.availableButton : styles.unavailableButton,
              ]}
              onPress={onToggleAvailability}
            >
              <Text style={styles.availabilityButtonText}>
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
            <View style={styles.adminActions}>
              <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          showControls && item.available && (
            <View style={styles.controls}>
              {quantity > 0 ? (
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={handleDecrement}>
                    <Feather name="minus-circle" size={24} color={Colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <TouchableOpacity onPress={handleIncrement}>
                    <Feather name="plus-circle" size={24} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unavailableContainer: {
    opacity: 0.7,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 8,
  },
  description: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  unavailableBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  unavailableText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  adminControls: {
    marginTop: 8,
  },
  availabilityButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  availableButton: {
    backgroundColor: Colors.success,
  },
  unavailableButton: {
    backgroundColor: Colors.error,
  },
  availabilityButtonText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  adminActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
});
