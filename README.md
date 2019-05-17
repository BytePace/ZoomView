# Zoom view
React native zoom view. Based on [react-native-easy-gestures](https://github.com/keske/react-native-easy-gestures) lib with few enhancements:
- Supports swiping
- Respects borders and doesn't allow to lose content out of focus
- Supports long views, such as tables and reports
- Configurable double-tap zoom.

![](https://media.giphy.com/media/izyVloLRej2OrtmYXh/giphy.gif)

## Installation
```
$ npm i react-native-border-zoom-view
```

## Usage

```javascript
import ZoomView from 'react-native-border-zoom-view';

<ZoomView style={{height: '100%', width: '100%'}} //default height is '100%', but you can configure it
          minZoom={1}   //1 is minimum
          maxZoom={3}
          zoomLevels={2} //count of double tap zoom levels. 2 is default, 0 disables double tap
          >
    <View>
      //Any content here
    </View>
</ZoomView>
```