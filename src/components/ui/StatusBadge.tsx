import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusColor, getStatusLabel } from '../../utils';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const backgroundColor = getStatusColor(status);
  const label = getStatusLabel(status);
  
  return (
    <View style={[
      styles.badge,
      { backgroundColor },
      size === 'small' && styles.smallBadge
    ]}>
      <Text style={[
        styles.text,
        size === 'small' && styles.smallText
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  smallText: {
    fontSize: 10,
  },
});

export default StatusBadge;