import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const Ball = ({}) => {
  const position = useRef(new Animated.ValueXY(0, 0)).current;

  Animated.spring(position, {
    toValue: { x: 200, y: 500 },
    useNativeDriver: false
  }).start();

  return (
    <Animated.View style={position.getLayout()}>
      <View style={styles.container}></View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: "black"
  }
});

export default Ball;
