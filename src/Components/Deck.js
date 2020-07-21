import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  PanResponder,
  Dimensions
} from "react-native";

const Deck = ({ renderCard, data }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const screenDimensions = Dimensions.get("window").width;
  const swipeDimension = 0.25 * screenDimensions;
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: {
        x: 0,
        y: 0
      }
    }).start();
  };
  const forceRightSwipe = () => {
    Animated.timing(position, {
      toValue: {
        x: screenDimensions,
        y: 0
      },
      duration: 250
    });
  };
  const forceLeftSwipe = () => {
    Animated.timing(position, {
      toValue: {
        x: -screenDimensions,
        y: 0
      },
      duration: 250
    });
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true;
      },
      onPanResponderMove: (event, gesture) => {
        // console.log("Move ", gesture);
        position.setValue({
          x: gesture.dx,
          y: gesture.dy
        });
      },
      onPanResponderRelease: (event, gesture) => {
        // console.log("Release ", gesture);
        if (gesture.dx > swipeDimension) {
          console.log("swipe right success");
          forceRightSwipe();
        } else if (swipeDimension.dx < -swipeDimension) {
          console.log("swipe left success");
          forceLeftSwipe();
        } else {
          resetPosition();
        }
      }
    })
  ).current;
  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-screenDimensions * 1.5, 0, screenDimensions * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };
  const renderCardList = () => {
    return data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            {...panResponder.panHandlers}
            style={getCardStyle()}>
            {renderCard(item)}
          </Animated.View>
        );
      }
      return renderCard(item);
    });
  };
  return <View>{renderCardList()}</View>;
};
const styles = StyleSheet.create({
  container: {}
});

export default Deck;
