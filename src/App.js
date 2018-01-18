import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
    Easing,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Constants, Svg } from 'expo';

import dummyData from './data';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const MUSICBUTTON = 50

const DARKER_GREY = "rgb(20, 22, 22)"
const DARK_GREY = "rgb(30, 32, 32)"
const LIGHT_GREY = 'rgb(130, 132, 132)'
const REDDISH = "rgb(250, 74, 77)"
const WHITE = 'white'


class MusicAnimation extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeSongIndex: 3,
            timePlayed: 0,
            playing: false,
            musicButtonTap: new Animated.Value(0),
            musicButtonAnimation: new Animated.Value(0),
            playListAnimation: new Animated.Value(0),
            songCoverAnimation: new Animated.Value(0),
            backgroundAnimation: new Animated.Value(0),
            rotateSongThumbNail: new Animated.Value(0),
        }
    }

    componentDidMount() {
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);

        this.state.backgroundAnimation.addListener(({value}) => {
            let _value = value*(HEIGHT*(1-2/3))
            d=`M30 0 L${WIDTH} ${HEIGHT-_value+30} L${WIDTH} 0 Z`
            this._backgroundTextureComponent.setNativeProps({d})
        })

        this.state.backgroundAnimation.addListener(({value}) => {
            this._musicPlayingCircularComponent.setNativeProps({opacity: 1-value})
            this._musicPlayingCircularProgressComponent.setNativeProps({opacity: 1-value})
        })

    }

    componentWillUnmount() {
        this.state.backgroundAnimation.removeAllListeners()
        clearInterval(this.timePlayedInterval)
    }

    animateAll = () => {
        const toValue = this.state.playing ? 0 : 1;

        if (!this.state.playing){

            Animated.timing(this.state.rotateSongThumbNail, {
                toValue: 0,
                duration: 100,
            },
            {
                nativeDriver: true
            }).start(() => {this.state.rotateSongThumbNail.stopAnimation()})
            
            Animated.sequence([
                Animated.timing(this.state.musicButtonTap, {
                    toValue,
                    duration: 200
                },
                {
                    nativeDriver: true
                }),
                Animated.parallel([
                    Animated.timing(this.state.songCoverAnimation, {
                        toValue,
                        duration: 300
                    },
                    {
                        nativeDriver: true
                    }),
                    Animated.timing(this.state.backgroundAnimation, {
                        toValue,
                        duration: 300
                    },
                    {
                        nativeDriver: true
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(this.state.musicButtonAnimation, {
                        toValue,
                        duration: 400
                    },
                    {
                        nativeDriver: true
                    }),
                    Animated.timing(this.state.playListAnimation, {
                        toValue,
                        duration: 500,
                    },
                    {
                        nativeDriver: true
                    })
                ])

            ]).start(() => {this.setState({ playing: !this.state.playing })})
        } else {
            const reverseTime = 400
            Animated.sequence([
                Animated.timing(this.state.musicButtonTap, {
                    toValue,
                    duration: reverseTime
                },
                {
                    nativeDriver: true
                }),
                Animated.parallel([

                    Animated.timing(this.state.songCoverAnimation, {
                        toValue,
                        duration: reverseTime
                    },
                    {
                        nativeDriver: true
                    }),
                    Animated.timing(this.state.backgroundAnimation, {
                        toValue,
                        duration: reverseTime
                    },
                    {
                        nativeDriver: true
                    }),
                    Animated.timing(this.state.musicButtonAnimation, {
                        toValue,
                        duration: reverseTime
                    },
                    {
                        nativeDriver: true
                    }),
                    Animated.timing(this.state.playListAnimation, {
                        toValue,
                        duration: reverseTime
                    },
                    {
                        nativeDriver: true
                    })
                ])
            ]).start(() => {
                this.setState({ playing: !this.state.playing })

                runAnimation = () => {
                    this.state.rotateSongThumbNail.setValue(0);
                    Animated.timing(this.state.rotateSongThumbNail, {
                        toValue: 1,
                        duration: 5000,
                    },
                    {
                        nativeDriver: true
                    }).start((o) => {
                        if (o.finished){
                            runAnimation()
                        } 
                    });
                }
                runAnimation()
            })
        }

        
    }

    renderBackground = () => {
        return (
            <View
                style={[StyleSheet.absoluteFill]}
                pointerEvents={"none"}
            >
                <Svg height={HEIGHT} width={WIDTH}>
                    <Svg.Path
                        ref={component => (this._backgroundTextureComponent = component)}
                        {...this.props}
                        d={`M30 0 L${WIDTH} ${HEIGHT+30} L${WIDTH} 0 Z`}
                        fill={"rgb(100, 100, 100, .3)"}
                        stroke={"rgb(100, 100, 100, .3)"}
                        strokeWidth={0}
                    />
                </Svg>
            </View>
        )
    }

    renderMusicButton = () => {
        const musicLeftInterpolate = this.state.musicButtonAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [WIDTH/2-(MUSICBUTTON/2), 0]
        })

        const musicBottomInterpolate = this.state.musicButtonAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [HEIGHT/2-(MUSICBUTTON/2), HEIGHT*2/3-(MUSICBUTTON/2)]
        })

        const musicBottomScaleInterpolate = this.state.musicButtonAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, .9]
        })

        const musicBottomTranslateYInterpolate = this.state.musicButtonAnimation.interpolate({
            inputRange: [0,  1],
            outputRange: [0,  0 ]
        })

        const musicBottomTapTranslateYInterpolate = this.state.musicButtonTap.interpolate({
            inputRange: [0, .5, 1],
            outputRange: [0, 5, 0]
        })

        const musicButtonTransforms = {
            transform:[
                {
                    scale: musicBottomScaleInterpolate
                },
                {
                    translateY: musicBottomTapTranslateYInterpolate
                }
            ],
            right: musicLeftInterpolate,
            bottom: musicBottomInterpolate,

        }

        return (
            <TouchableWithoutFeedback onPress={this.animateAll}>
                <Animated.View
                    style={[styles.musicButtonStyle, musicButtonTransforms]}
                >
                    <Entypo
                        name={this.state.playing ? "controller-play": "controller-paus"}
                        size={32}
                        color={WHITE}
                    />
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }

    renderPlayListSongs = () => {

        const songItemTranslateYInterpolate = this.state.playListAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0]
        })

        const songItemTransform = {
            transform: [
                {
                    translateY: songItemTranslateYInterpolate
                }
            ]
        }

        renderSong = (song, idx) => {

            const translateYSong = this.state.playListAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [idx*250, 1]
            })

            const translateYSongStyle = {
                transform: [
                    {
                        translateY: translateYSong
                    }
                ]
            }

            return (
                <TouchableWithoutFeedback key={idx} onPress={() => {
                    this.setState({activeSongIndex: idx})
                    this.animateAll()
                }}>
                    <Animated.View style={[translateYSongStyle, styles.songListInfoStyle]}>
                        <Image
                            source={song.thumbnail}
                            resizeMode={"contain"}
                            style={{height: 60, width: 50}}
                        />
                        <View 
                            style={{flex: 1, flexDirection: 'row', justifyContent:'space-between',  marginLeft: 10}}
                        >
                            <View>
                                <Text
                                    style={[styles.playListInfoTextStyle, {textAlign:'left', fontWeight: 'bold'}]}
                                >
                                    {song.title}
                                </Text>
                                <Text
                                    style={[styles.playListInfoTextStyle, {textAlign:'left', fontSize: 12, color: 'lightgrey'}]}
                                >
                                    {song.singer}
                                </Text>
                            </View>
                            <Text style={[styles.playListInfoTextStyle, {fontSize: 12, color: 'lightgrey'}]}>{song.length}</Text>
                        </View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )
        }

        return (
            <ScrollView>
                {
                    dummyData.map((song, idx) => {
                        return (renderSong(song, idx))
                    })
                }
            </ScrollView>
        )
    }

    generateArc = (x, y) => {
        /*
        For White big Circle

        d={`M${HEIGHT/12} ${HEIGHT/3.275}
            ${this.generateArc(0, HEIGHT/6)}
            ${this.generateArc(HEIGHT/3, HEIGHT/6)}
            ${this.generateArc(HEIGHT/4, HEIGHT/3.275)}
          `}

        For red small circle

        d={`M${HEIGHT/12} ${HEIGHT/3.275} ${this.generateArc(0, HEIGHT/6)}`}

        */

        const r = HEIGHT/6
        var rx = r,
            ry = r,
            xAxisRotation = 0,
            largeArcFlag = 0,
            sweepFlag = 1
    
        return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`
    }

    renderSongCoverImage = () => {

        const CoverImageTranslate = this.state.songCoverAnimation.interpolate({
            inputRange: [0, .75, 1],
            outputRange: [HEIGHT/3, 0, 0]
        })

        const CoverImageTransforms = {
            transform: [
                {
                    translateY: CoverImageTranslate
                }
            ]
        }

        const CoverImageBackgroundExpansion = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1.5, 4]
        })

        const CoverImageBackgroundExpansionStyle = {
            transform: [
                {
                    scale: CoverImageBackgroundExpansion
                }
            ]
        }

        const CoverImageExpansion = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [.9, 1]
        })

        const rotateSongThumbNailInterpolate = this.state.rotateSongThumbNail.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        const CoverImageExpansionStyle = {
            transform: [
                {
                    rotate: rotateSongThumbNailInterpolate 
                }
            ]
        }

        const marginInterpolate = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [(WIDTH - HEIGHT/3)/2, 0]
        })

        const marginInterpolateStyle = {
            width: marginInterpolate
        }

        const playingSongIndicatorOpacity = this.state.songCoverAnimation.interpolate({
            inputRange: [0, .1, 1],
            outputRange: [1, 0, 0]
        })

        const playingSongIndicatorOpacityStyle = {
            opacity: playingSongIndicatorOpacity
        }

        return (
            <Animated.View style={[CoverImageTransforms, { backgroundColor: DARK_GREY, height: HEIGHT/3}]}>
                <View style={{flexDirection: 'row'}}>
                    <Animated.View style={[marginInterpolateStyle, {backgroundColor: DARK_GREY, height: HEIGHT/3}]}/>
                    <Animated.Image
                        source={dummyData[this.state.activeSongIndex].thumbnail}
                        resizeMode={"cover"}
                        style={[CoverImageExpansionStyle, {height: HEIGHT/3, flex:1}]}
                    />
                    <Svg height={HEIGHT/3} width={HEIGHT/3}
                        style={{
                            position: "absolute",
                            zIndex: 99,
                            left: (WIDTH - HEIGHT/3)/2,
                        }}
                    >
                        <Svg.Path
                            ref={component => (this._musicPlayingCircularComponent = component)}
                            {...this.props}
                            d={`M${HEIGHT/12} ${HEIGHT/3.275+3}
                                ${this.generateArc(0, HEIGHT/6)}
                                ${this.generateArc(HEIGHT/3, HEIGHT/6)}
                                ${this.generateArc(HEIGHT/4, HEIGHT/3.275+2)}
                              `}
                            fill={"transparent"}
                            stroke={WHITE}
                            strokeWidth={2}
                        />
                        <Svg.Path
                            ref={component => (this._musicPlayingCircularProgressComponent = component)}
                            {...this.props}
                            d={`M${HEIGHT/12} ${HEIGHT/3.275+3} ${this.generateArc(0, HEIGHT/6)}`}
                            fill={"transparent"}
                            stroke={REDDISH}
                            strokeWidth={2}
                        />
                    </Svg>
                    <Animated.View style={[marginInterpolateStyle, {backgroundColor: DARK_GREY, height: HEIGHT/3}]}/>
                    <Animated.View
                        style={[CoverImageBackgroundExpansionStyle, {
                            position: 'absolute',
                            left: (WIDTH - HEIGHT/3)/2,
                            height: HEIGHT/3,
                            width: HEIGHT/3,
                            borderWidth: 50,
                            borderRadius: (WIDTH - HEIGHT/3),
                            borderColor: DARK_GREY
                        }]}
                    />

                </View>

            </Animated.View>
        )
    }

    renderplayListInfo = () => {
        return (
            <Animated.View style={[styles.playListInfoStyle]}>
                <View>
                    <Text style={styles.playListInfoTextStyle}>My Favourites</Text>
                    <Text style={[styles.playListInfoTextStyle, {fontSize: 12, color: LIGHT_GREY}]}>102 songs</Text>
                </View>
                <View style={{marginTop: 10}}>
                    <Entypo
                        name={"dots-three-vertical"}
                        size={14}
                        color={WHITE}
                    />
                </View>
            </Animated.View>
        )
    }

    renderMusicSettingButtons = () => {
        const settingButtonTranslateY = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0]
        })

        const settingButtonOpacity = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
        })
    
        const settingButtonTranslateYStyle = {
            transform: [
                {
                    translateY: settingButtonTranslateY
                }
            ],
            opacity: settingButtonOpacity
        }
        return (
            <Animated.View style={[styles.musicSettingButtonsContainerStyle, settingButtonTranslateYStyle]}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10}}>
                    <Text style={[styles.numberTextStyle]}>00: 0{this.state.timePlayed}</Text>
                    <Text style={[styles.numberTextStyle]}>{dummyData[this.state.activeSongIndex].length}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Entypo
                        name={"loop"}
                        size={22}
                        color={LIGHT_GREY}
                        style={{ marginRight: 10}}
                    />
                    <Entypo
                        name={"shuffle"}
                        size={22}
                        color={LIGHT_GREY}
                        style={{ marginLeft: 10 }}

                    />
                </View>
            </Animated.View>
        )
    }

    renderMusicControlButtons = () => {
        const playListTranslateY = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [40, HEIGHT/3]
        })
    
        const playListTransformStyle = {
            transform: [
                {
                    translateY: playListTranslateY
                }
            ]
        }      
        return (
            <Animated.View style={[styles.musicControlButtonsContainerStyle, playListTransformStyle]}>
                <View style={{flex: 1, height: HEIGHT/3, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Entypo
                        name={"triangle-left"}
                        size={32}
                        color={LIGHT_GREY}
                    />
                    <Entypo
                        name={"controller-fast-backward"}
                        size={32}
                        color={LIGHT_GREY}
                    />
                    <Entypo
                        name={"controller-fast-forward"}
                        size={32}
                        color={LIGHT_GREY}
                    />
                    <Entypo
                        name={"triangle-right"}
                        size={32}
                        color={LIGHT_GREY}
                    />
                </View>
            </Animated.View>
        )
    }

    renderplayingSongDetail = () => {
        const playingSongOpacity = this.state.songCoverAnimation.interpolate({
            inputRange: [0, .75, 1],
            outputRange: [1, 1, .8]
        })

        const playingSongBackgroundColor = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [DARK_GREY, DARKER_GREY]
        })

        const playingSongInterpolate = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0]
        })

        const playingSongStyle = {
            opacity: playingSongOpacity,
            backgroundColor: playingSongBackgroundColor,
            transform: [
                {
                    translateY: playingSongInterpolate
                }
            ]
        }

        const opacityMusicProgress = this.state.songCoverAnimation.interpolate({
            inputRange: [0, .8, 1],
            outputRange: [0, 1, 1]
        })

        const opacityMusicProgressStyle = {
            opacity: opacityMusicProgress
        }

        const translateMusicProgress = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0]
        })

        const translateMusicProgressStyle = {
            transform: [
                {
                    translateY: translateMusicProgress
                }
            ],
            opacity: opacityMusicProgress
        }

        const translateSongName = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -75]
        })

        const translateSongNameStyle = {
            transform: [
                {
                    translateX: translateSongName
                }
            ],
        }

        const resizeFont = this.state.songCoverAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [22, 14]
        })

        const resizeFontStyle = {
            fontSize: resizeFont
        }

        return(
            <Animated.View 
                style={[styles.playingSongDetailStyle, playingSongStyle]}
            >
                <Animated.View style={[{flexDirection: 'row', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 10 }]}>
                    <Animated.Text 
                        style={[translateSongNameStyle, resizeFontStyle,
                               {color: WHITE, textAlign: 'right', fontWeight: 'bold'}]}
                    >
                        {dummyData[this.state.activeSongIndex].title}
                    </Animated.Text>
                    <Animated.Text
                        style={[translateSongNameStyle, resizeFontStyle,
                              {color: LIGHT_GREY, textAlign: 'center', fontWeight: 'bold', paddingHorizontal: 5}]}
                    >
                        -
                    </Animated.Text>
                    <Animated.Text  
                        style={[translateSongNameStyle, resizeFontStyle,
                              {color: LIGHT_GREY, textAlign: 'left', fontWeight: 'bold'}]}
                    > 
                        {dummyData[this.state.activeSongIndex].singer}
                    </Animated.Text>
                </Animated.View>
                <View
                    style={[{flexDirection: 'row', justifyContent: 'flex-start', flex: 1, paddingHorizontal: 10}]}
                >
                    <Animated.Text
                        style={[translateMusicProgressStyle, styles.numberTextStyle]}
                    >
                        00: 3{this.state.timePlayed}
                    </Animated.Text>
                    <Animated.View
                        style={[opacityMusicProgressStyle, {width: "60%", flexDirection: 'row', marginLeft: 7, marginRight: 7}]}
                    >
                        <View style={{height: 2, width: "30%", backgroundColor: REDDISH, marginTop: 7}}/>
                        <View style={{height: 2, width: "70%", backgroundColor: LIGHT_GREY, marginTop: 7}}/>
                    </Animated.View>
                    <Animated.Text
                        style={[translateMusicProgressStyle, styles.numberTextStyle]}
                    >
                       {dummyData[this.state.activeSongIndex].length}
                    </Animated.Text>
                </View>
            </Animated.View>
        )
    }

    render() {

        const playListTranslateY = this.state.playListAnimation.interpolate({
            inputRange: [0, .1, 1],
            outputRange: [HEIGHT, HEIGHT/2,0]
        })
    
        const playListTransformStyle = {
            transform: [
                {
                    translateY: playListTranslateY
                }
            ]
        }        

        return (
            <View style={styles.musicControlStyle}>
                <Animated.View>
                    {this.renderSongCoverImage()}
                    {this.renderplayingSongDetail()}
                </Animated.View>
                <Animated.View style={[styles.playlistStyle, playListTransformStyle]}>
                    {this.renderplayListInfo()}
                    {this.renderPlayListSongs()}
                </Animated.View>
                {this.renderMusicSettingButtons()}
                {this.renderMusicControlButtons()}
                {this.renderMusicButton()}
                {this.renderBackground()}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    musicControlStyle: {
        flex: 1,
    },
    musicButtonStyle: {
        position: 'absolute',
        backgroundColor: REDDISH,
        height: MUSICBUTTON,
        width: MUSICBUTTON,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    playlistStyle: {
        flex: 1,
        backgroundColor: DARK_GREY,
    },
    playListInfoStyle: {
        backgroundColor: DARK_GREY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    playListInfoTextStyle: {
        color: WHITE
    },
    playingSongDetailStyle: {
        height: 60,
        backgroundColor: DARKER_GREY,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    songListInfoStyle: {
        flex: 1,
        height: 80,
        backgroundColor: DARK_GREY,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    numberTextStyle: {
        color: LIGHT_GREY,
        textAlign: 'left',
        fontSize: 12,
        backgroundColor: 'transparent'
    },
    musicControlButtonsContainerStyle: {
        position: 'absolute',
        bottom: 0,
        width: "100%",
    },
    musicSettingButtonsContainerStyle: {
        position: 'absolute',
        bottom: HEIGHT/3,
        width: "100%",
    }
})


export default MusicAnimation;