import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '@/constants/colors';
import { Canteen } from '@/types';

interface CanteenCardProps {
  canteen: Canteen;
  onPress: () => void;
}

export default function CanteenCard({ canteen, onPress }: CanteenCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: canteen.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{canteen.name}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather name="star" size={14} color={Colors.warning} />
            <Text style={styles.infoText}>{canteen.rating}</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="clock" size={14} color={Colors.primary} />
            <Text style={styles.infoText}>{canteen.estimatedTime}</Text>
          </View>
        </View>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={Colors.grayDark} />
          <Text style={styles.locationText} numberOfLines={1}>
            {canteen.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
    flex: 1,
  },
});
