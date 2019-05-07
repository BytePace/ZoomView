import ZoomHandler from "./ZoomHandler";
import {View} from "react-native";
import React from "react";


class ZoomView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            containerSize: {width: 0, height: 0},
        };
    }

    render() {
        const {style, children, minZoom, maxZoom, zoomLevels} = this.props;
        return (
            <View
                style={{height: '100%', overflow: 'hidden', ...style,}}
                onLayout={(event) => {
                    const {width, height} = event.nativeEvent.layout;
                    const containerSize = {width, height};
                    this.setState({containerSize});
                }}
            >
                <ZoomHandler
                    containerSize={this.state.containerSize}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    zoomLevels={zoomLevels}
                >
                    {children}
                </ZoomHandler>
            </View>
        );
    }
}

export default ZoomView;
