import React from 'react';
import {Animated, Dimensions, View,} from 'react-native';
import Gestures from 'react-native-easy-gestures';
import styles from './styles';

const getZoom = (info) => {
    let {scale} = info.transform[0];
    if (!scale) scale = info.transform[1].scale;
    return scale;
};

const DOUBLE_PRESS_DELAY = 600;
const DOUBLE_PRESS_DISTANCE = 20;

class ZoomHandler extends React.Component {
    constructor(props) {
        super(props);
        this.coolDown = 0;
        this.lastPressTime = 0;
        this.lastTouchInfo = {x: -1000, y: -1000, type: 'idk,lol'};
        this.currentTouchInfo = {startX: -1000, startY: -1000};
        this.onTouchEnded = this.onTouchEnded.bind(this);
        this.onTouchStarted = this.onTouchStarted.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFlingAnim = this.onFlingAnim.bind(this);
        this.onOrientationChange = this.onOrientationChange.bind(this);
        this.anim = new Animated.ValueXY({x: 0, y: 0});
        this.savedDragstyles = {left: 0, top: 0};
        this.setDefault = false;
        this.newCoordinates = {
            xIsNew: false,
            yIsNew: false,
            x: 0,
            y: 0,
        };
        const levels = props.zoomLevels ? props.zoomLevels : 2;
        this.doubleTapEnabled = props.zoomLevels > 0;
        this.zoomLevels = [];
        this.minZoom = props.minZoom ? (props.minZoom < 1 ? 1 : props.minZoom) : 1;
        this.maxZoom = props.maxZoom ? props.maxZoom : 3;
        for (let i = 0; i <= levels; i++) {
            this.zoomLevels.push(this.minZoom + i * ((this.maxZoom - this.minZoom) / levels));
        }
    }

    componentWillReceiveProps() {
        this.setDefault = true;
        if (this.paneLayout) this.onOrientationChange();
    }

    onChange(event, info, containerSize) {
        const {timestamp, pageX, pageY} = event.nativeEvent;
        const scale = getZoom(info);
        if (this.paneLayout) {
            this.borderZoom(scale, containerSize);
        }
        const timeDifference = timestamp - this.currentTouchInfo.prevT;
        if (timeDifference > 50) {
            this.currentTouchInfo = {
                ...this.currentTouchInfo,
                prevX: pageX,
                prevY: pageY,
                prevT: timestamp,
                dX: pageX - this.currentTouchInfo.prevX,
                dY: pageY - this.currentTouchInfo.prevY,
                dT: timeDifference,
            };
        }
    }

    onFlingAnim(x, y, info) {
        if (!this.zoomPanel) {
            return;
        }

        if (!this.zoomPanel.dragStyles) {
            this.zoomPanel.dragStyles = {};
        }

        if (x !== this.zoomPanel.dragStyles.left) {
            this.newCoordinates.x = x;
            this.newCoordinates.xIsNew = true;
        }
        if (y !== this.zoomPanel.dragStyles.top) {
            this.newCoordinates.y = y;
            this.newCoordinates.yIsNew = true;
        }
        if (this.newCoordinates.xIsNew && this.newCoordinates.yIsNew) {
            this.zoomPanel.dragStyles = {
                left: this.newCoordinates.x,
                top: this.newCoordinates.y,
            };
            const scale = getZoom(info);
            const {containerSize} = this.props;
            this.borderZoom(scale, containerSize);
            this.zoomPanel.updateStyles();
            this.newCoordinates = {xIsNew: false, yIsNew: false};
        }
    }

    onTouchEnded(event, info, containerSize, recursion) {
        if (!containerSize) {
            return;
        }

        if (this.savedDragstyles === undefined || this.savedDragstyles.left === undefined || !event.nativeEvent) {
            if (!event.nativeEvent) return;
            if (recursion < 2) {
                setTimeout(() => this.onTouchEnded(event, info, containerSize, recursion + 1), 50);
            }
            return;
        }
        const {
            timestamp, pageX, pageY, locationX, locationY,
        } = event.nativeEvent;
        const distanceX = pageX - this.currentTouchInfo.startX;
        const distanceY = pageY - this.currentTouchInfo.startY;
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        // double tap execution
        const delta = timestamp - this.lastPressTime;
        this.lastPressTime = timestamp;
        const lastTouchDistance = Math.sqrt(
            Math.pow(pageX - this.lastTouchInfo.x, 2) + Math.pow(pageY - this.lastTouchInfo.y, 2),
        );

        if (delta < DOUBLE_PRESS_DELAY && lastTouchDistance < DOUBLE_PRESS_DISTANCE && this.doubleTapEnabled) {
            const scale = getZoom(info);
            let requiredScale = this.zoomLevels[0];
            for (let el of this.zoomLevels) {
                if (scale < el) {
                    requiredScale = el;
                    break;
                }
            }

            if (this.savedDragstyles.left === undefined) {
                this.savedDragstyles = this.zoomPanel.dragStyles;
            }

            const extraScaledWidth = ((requiredScale - 1) * this.paneLayout.width) / 2;
            const extraScaledHeight = ((requiredScale - 1) * this.paneLayout.height) / 2;
            const oldExtraScaledWidth = ((scale - 1) * this.paneLayout.width) / 2;
            const oldExtraScaledHeight = ((scale - 1) * this.paneLayout.height) / 2;

            const screenCenterX = containerSize.width / 2;
            const screenCenterY = containerSize.height / 2;

            // TODO: next string only works if there is something above our view
            const yModifier = Math.abs(containerSize.height - Dimensions.get('window').height);

            const x = (this.savedDragstyles.left - oldExtraScaledWidth - pageX) / scale;
            const y = (this.savedDragstyles.top - oldExtraScaledHeight - pageY + yModifier) / scale;

            const resultX = x * requiredScale + extraScaledWidth + screenCenterX;
            const resultY = y * requiredScale + extraScaledHeight + screenCenterY;

            this.setZoom(requiredScale);

            this.zoomPanel.dragStyles = {left: resultX, top: resultY};

            this.lastPressTime = 0;
            this.lastTouchInfo = {x: -1000, y: -1000, type: 'idk,lol'};

            this.borderZoom(requiredScale, containerSize);
            this.zoomPanel.updateStyles();
            return;
        }

        // double tap setup
        if (distance > 20) {
            this.lastTouchInfo = {x: -1000, y: -1000, type: 'fling'};
        } else {
            this.lastTouchInfo = {
                x: this.currentTouchInfo.startX,
                y: this.currentTouchInfo.startY,
                type: 'tap',
            };
        }

        // fling action
        if (event.nativeEvent.touches.length > 0) {
            this.coolDown = timestamp;
            return;
        }
        if (timestamp - this.coolDown < 400 && this.coolDown > 0) {
            this.coolDown = 0;
            return;
        }
        const dt = this.currentTouchInfo.dT === 0
            ? timestamp - this.currentTouchInfo.startTime
            : this.currentTouchInfo.dT;
        const dX = this.currentTouchInfo.dX === 0
            ? pageX - this.currentTouchInfo.prevX
            : this.currentTouchInfo.dX;
        const dY = this.currentTouchInfo.dY === 0
            ? pageY - this.currentTouchInfo.prevY
            : this.currentTouchInfo.dY;
        if (!dt || dt === 0) return;

        const speedX = dX / dt;
        const speedY = dY / dt;
        const time = Math.abs(Math.max(speedX, speedY) * 2500);
        if (!speedX || speedX === 0) return;
        if (!speedY || speedY === 0) return;

        const flingDistanceX = speedX * 2500;
        const flingDistanceY = speedY * 2500;

        const finalValX = this.zoomPanel.dragStyles.left + flingDistanceX;
        const finalValY = this.zoomPanel.dragStyles.top + flingDistanceY;

        if (!finalValX || finalValX === 0) return;
        if (!finalValY || finalValY === 0) return;

        this.anim.setValue({x: this.zoomPanel.dragStyles.left, y: this.zoomPanel.dragStyles.top});
        Animated.decay(this.anim, {
            velocity: {x: speedX, y: speedY},
            toValue: {x: finalValX, y: finalValY},
            duration: time,
            useNativeDriver: true,
        }).start();
        this.anim.addListener((val) => {
            this.onFlingAnim(val.x, val.y, info);
        });
        this.newCoordinates = {xIsNew: false, yIsNew: false};
    }

    async onOrientationChange() {
        if (!this.setDefault) return;
        if (this.zoomPanel) {
            this.anim.removeAllListeners();
            this.zoomPanel.dragStyles = {
                top: 0,
                left: 0,
            };
            this.setZoom(this.minZoom);
            this.zoomPanel.updateStyles();
            this.setDefault = false;
        } else {
            setTimeout(this.onOrientationChange(), 50);
        }
    }

    onTouchStarted(event, info) {
        this.anim.removeAllListeners();
        const {timestamp, pageX, pageY} = event.nativeEvent;
        this.currentTouchInfo = {
            startX: pageX,
            startY: pageY,
            dX: 0,
            dY: 0,
            prevX: pageX,
            prevY: pageY,
            prevT: timestamp,
            startTime: timestamp,
            dT: 0,
        };
    }

    setZoom(scale) {
        this.zoomPanel.pinchStyles = {transform: []};
        this.zoomPanel.pinchStyles.transform.push({scale});
    }

    borderZoom(scale, containerSize) {
        if (!containerSize) {
            return;
        }

        this.zoomPanel.dragStyles = this.zoomPanel.dragStyles ? this.zoomPanel.dragStyles : {};
        const scaledWidth = scale * this.paneLayout.width;
        const extraScaledWidth = ((scale - 1) * this.paneLayout.width) / 2;
        const scaledHeight = scale * this.paneLayout.height;
        const extraScaledHeight = ((scale - 1) * this.paneLayout.height) / 2;
        if (this.zoomPanel.dragStyles.left > extraScaledWidth) {
            this.zoomPanel.dragStyles = {
                ...this.zoomPanel.dragStyles,
                left: extraScaledWidth,
            };
        }
        if (this.zoomPanel.dragStyles.left + scaledWidth < scaledWidth - extraScaledWidth) {
            this.zoomPanel.dragStyles = {
                ...this.zoomPanel.dragStyles,
                left: -extraScaledWidth,
            };
        }
        if (
            -this.zoomPanel.dragStyles.top + containerSize.height
            > scaledHeight - extraScaledHeight
        ) {
            this.zoomPanel.dragStyles = {
                ...this.zoomPanel.dragStyles,
                top: -scaledHeight + containerSize.height + extraScaledHeight,
            };
        }
        if (this.zoomPanel.dragStyles.top > extraScaledHeight) {
            this.zoomPanel.dragStyles = {
                ...this.zoomPanel.dragStyles,
                top: extraScaledHeight,
            };
        }
        this.savedDragstyles = this.zoomPanel.dragStyles;
    }

    render() {
        const {containerSize, children, overflow} = this.props;

        return (
            <View style={{...styles.topOverflow, overflow}}>
                <Gestures
                    ref={(ref) => {
                        this.zoomPanel = ref;
                        if (this.paneLayout && this.zoomPanel) {
                            this.borderZoom(this.scale || this.minZoom, containerSize);
                            this.zoomPanel.updateStyles();
                        }
                        return this.zoomPanel;
                    }}
                    rotatable={false}
                    onChange={(event, info) => {
                        if (this.zoomPanel) {
                            this.onChange(event, info, containerSize);
                            this.zoomPanel.updateStyles();
                        }
                    }}
                    onStart={(event, info) => {
                        if (this.zoomPanel) {
                            this.onTouchStarted(event, info);
                            this.zoomPanel.updateStyles();
                        }
                    }}
                    onEnd={(event, info) => {
                        if (this.zoomPanel) {
                            this.onTouchEnded(event, info, containerSize, 0);
                        }
                    }}
                    scalable={{
                        min: this.minZoom,
                        max: this.maxZoom,
                    }}
                    onScaleEnd={(event, info) => {
                        if (this.zoomPanel) {
                            const scale = getZoom(info);
                            if (this.paneLayout) {
                                this.borderZoom(scale, containerSize);
                                this.zoomPanel.updateStyles();
                                this.scale = scale;
                            }
                        }
                    }}
                >
                    <View
                        style={{minHeight: containerSize.height}}
                        onLayout={(event) => {
                            const {width, height} = event.nativeEvent.layout;
                            this.paneLayout = {width, height};
                            this.onOrientationChange();
                        }}
                    >
                        {children}
                    </View>
                </Gestures>
            </View>
        );
    }
}

export default ZoomHandler;
