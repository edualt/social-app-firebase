import React from 'react';
import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';

export const AppButton = ({
  onPress,
  title,
  borderRadius,
  paddingHorizontal,
}: {
  onPress: any;
  title: any;
  borderRadius?: number;
  paddingHorizontal?: number;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.appButtonContainer,
      {borderRadius: borderRadius || 6},
      {paddingHorizontal: paddingHorizontal || 12},
    ]}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 0,
    backgroundColor: '#4C68D5',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'center',
  },
});
