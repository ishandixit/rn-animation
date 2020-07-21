import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  PanResponder,
  Dimensions
} from "react-native";

const Deck = ({ renderCard, data, onSwipeRight, onSwipeLeft,renderNoCards }) => {
  const [indexValue,setIndexValue] = useState(0);
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
  const handleListWithSwipe = direction => {
    console.log("inside handle ", direction);
    
    if (direction === "right") {
      onSwipeRight(data[indexValue]);
    } else {
      onSwipeLeft(data[indexValue]);
    }
    position.setValue({ x: 0, y: 0 });
    console.log(indexValue, "indexValue");
    setIndexValue((indexValue)=> indexValue+ 1);
  };
  const forceSwipe = direction => {
    const screenWidth =
      direction === "right" ? screenDimensions : -screenDimensions;
    Animated.timing(position, {
      toValue: {
        x: screenWidth,
        y: 0
      },
      duration: 250
    }).start(() => {
      handleListWithSwipe(direction);
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
        console.log(gesture.dx, swipeDimension);
        if (gesture.dx > swipeDimension) {
          console.log("swipe right success");
          forceSwipe("right");
        } else if (gesture.dx < -swipeDimension) {
          console.log("swipe left success");
          forceSwipe("left");
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
    console.log(indexValue,"hdgfkhfdljl")
    if(indexValue>=data.length){
      return renderNoCards()
    }
    return data.map((item, index) => {

      if (index < indexValue) {
        return null;
      }
      if (index === indexValue) {
        return (
          <Animated.View
            key={item.id}
            {...panResponder.panHandlers}
            style={[getCardStyle(),styles.cardStyle]}>
            {renderCard(item)}
          </Animated.View>
        );
      }
      return <View key={item.id} style={[styles.cardStyle,{top:10*(index-indexValue)}]}>{renderCard(item)}</View>;
    }).reverse();
  };
  return <View >{renderCardList()}</View>;
};
const styles = StyleSheet.create({
  cardStyle: {
    position:"absolute",
    left:0,
    right:0
  }
});
Deck.defaultProps = {
  onSwipeRight: () => {},
  onSwipeLeft: () => {}
};

export default Deck;
