import React from 'react';
import {StyleSheet, Image, Text, View,} from 'react-native';
import ZoomView from "../components/ZoomView";

class Sample extends React.Component {
    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <ZoomView style={{width: '100%', height: '100%'}} overflow={'visible'}>
                    <View style={styles.container}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: '25%', height: 100}} source={{uri: 'https://i.kym-cdn.com/photos/images/newsfeed/001/328/469/2a0.jpg'}}/>
                            <Image style={{width: '25%', height: 100}} source={{uri: 'https://i.pinimg.com/originals/bf/59/e2/bf59e2cbe15b06379e29023188d9115e.jpg'}}/>
                            <Image style={{width: '25%', height: 100}} source={{uri: 'https://www.pixilart.com/images/art/8a12360014c76e2.png'}}/>
                            <Image style={{width: '25%', height: 100}} source={{uri: 'https://ih1.redbubble.net/image.564901676.9479/flat,550x550,075,f.u1.jpg'}}/>
                        </View>
                    </View>
                </ZoomView>
            </View>
        );
    }
}

//<Text style={styles.welcome}>Lorem ipsum banana sit amet, consectetur adipiscing cat, sed do eiusmod tempor incididunt ut labore et bananae magna cat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis cat irure banana in reprehenderit in voluptate cat esse cillum bananae eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
    },
    welcome: {
        width: '100%',
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        width: '100%',
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default Sample;
