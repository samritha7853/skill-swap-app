import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
  showText?: boolean;
}

export default function RatingStars({ rating, count, size = 18, showText = true }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {[...Array(fullStars)].map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={size} color="#FFB020" />
        ))}
        {hasHalfStar && <Icon name="star-half-full" size={size} color="#FFB020" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Icon key={`empty-${i}`} name="star-outline" size={size} color="#E2E8F0" />
        ))}
      </View>
      {showText && (
        <Text style={styles.text}>
          {rating.toFixed(1)} {count !== undefined && `(${count} reviews)`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
