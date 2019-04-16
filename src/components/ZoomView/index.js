import ZoomHandler from "../ZoomHandler";
import {Text, View} from "react-native";
import React from "react";


class ZoomView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            containerSize: {width: 0, height: 0},
        };
    }

    render() {
        const {style, children, overflow} = this.props;
        return (
            <View
                style={{height: undefined, ...style}}
                onLayout={(event) => {
                    const {width, height} = event.nativeEvent.layout;
                    const containerSize = {width, height};
                    this.setState({containerSize});
                }}
            >
                <ZoomHandler
                    overflow={overflow}
                    containerSize={this.state.containerSize}>
                    <Text>width = {this.state.containerSize.width} ; height = {this.state.containerSize.height}</Text>
                    {children}
                </ZoomHandler>
            </View>
        );
    }
}

export default ZoomView;
