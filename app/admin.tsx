import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Switch, StyleSheet, TouchableOpacity } from 'react-native';

type FoodItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
};

type OrderItemType = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  studentName: string;
  items: OrderItemType[];
};

export default function AdminPage() {
  const [showMenu, setShowMenu] = useState(false);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      studentName: 'John Doe',
      items: [
        { name: 'Idli', quantity: 2, price: 30 },
        { name: 'Dosa', quantity: 1, price: 50 },
      ],
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      items: [
        { name: 'Poha', quantity: 1, price: 25 },
        { name: 'Tea', quantity: 2, price: 10 },
      ],
    },
  ]);

  const handleAddFood = () => {
    if (!name || !price) {
      alert('Please enter name and price');
      return;
    }

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      available,
    };

    setFoodItems([...foodItems, newItem]);
    setName('');
    setPrice('');
    setAvailable(true);
  };

  const handleDeleteFood = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setFoodItems(foodItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const calculateTotal = (items: { quantity: number; price: number }[]) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /** OrderItem Component for FlatList */
const OrderItem = ({ item }: { item: Order }) => {
  const [completed, setCompleted] = useState(false);
  const [picked, setPicked] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [savedTime, setSavedTime] = useState<string | null>(null);

  const handleComplete = () => setCompleted(true);
  const handlePicked = () => {
    setPicked(true);
    setOrders(prev => prev.filter(o => o.id !== item.id));
  };

  const handleSaveTime = () => {
    if (!estimatedTime) {
      alert('Please enter estimated time');
      return;
    }
    setSavedTime(estimatedTime);
    setEstimatedTime('');
  };

  return (
    <View style={styles.orderItem}>
      <Text style={{ fontWeight: 'bold' }}>{item.studentName}'s Order</Text>
      {item.items.map((i, index) => (
        <Text key={index}>
          {i.quantity} x {i.name} @ ₹{i.price} each
        </Text>
      ))}
      <Text style={{ marginTop: 5 }}>
        Total: ₹{calculateTotal(item.items).toFixed(2)}
      </Text>

      {/* Estimated Time Section */}
      {!savedTime ? (
        <View style={{ marginTop: 10 }}>
          <TextInput
            placeholder="Estimated time (min)"
            value={estimatedTime}
            onChangeText={setEstimatedTime}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Set Timer" onPress={handleSaveTime} />
        </View>
      ) : (
        <Text style={{ marginTop: 5 }}>
          Estimated Completion Time: {savedTime} min
        </Text>
      )}

      {/* Complete & Picked buttons */}
      {!completed ? (
        <Button title="Complete Order" onPress={handleComplete} />
      ) : !picked ? (
        <Button title="Order Picked" onPress={handlePicked} color="green" />
      ) : null}
    </View>
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Canteen Admin Panel</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setShowMenu(!showMenu)}
      >
        <Text style={styles.menuButtonText}>MENU</Text>
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Manage Food Items</Text>

          <TextInput
            placeholder="Food Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.availabilityContainer}>
            <Text>Available:</Text>
            <Switch value={available} onValueChange={setAvailable} />
          </View>

          <Button title="Add Food Item" onPress={handleAddFood} />

          <FlatList
            data={foodItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.foodItem}>
                <Text>{item.name} - ₹{item.price.toFixed(2)} - {item.available ? 'Available' : 'Unavailable'}</Text>
                <View style={styles.foodItemButtons}>
                  <Button
                    title="Toggle"
                    onPress={() => toggleAvailability(item.id)}
                  />
                  <Button
                    title="Delete"
                    color="red"
                    onPress={() => handleDeleteFood(item.id)}
                  />
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* Orders Section */}
      <Text style={styles.sectionTitle}>Current Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OrderItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  menuButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5, marginBottom: 20 },
  menuButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  availabilityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  foodItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  foodItemButtons: { flexDirection: 'row', gap: 10, marginTop: 5 },
  orderItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  menuContainer: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
});
