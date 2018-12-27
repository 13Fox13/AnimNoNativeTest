import React, { Component } from 'react'
import {StyleSheet, Image, View, Animated, PanResponder } from 'react-native'
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants'

const Cards = [
  {id: 1, uri: require('../../res/images/111.jpg')},
  {id: 2, uri: require('../../res/images/222.jpg')},
  {id: 3, uri: require('../../res/images/333.jpg')},
  {id: 4, uri: require('../../res/images/444.jpg')}
]

export default class Task extends Component {

  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateTranslate = {
      transform:[{
        rotate: this.rotate
      },
        ...this.position.getTranslateTransform()
      ]
    }

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })
  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dx > 120){
          Animated.spring(this.position,{
            toValue:{x: SCREEN_WIDTH+100, y: gestureState.dy}
          }).start(()=>{
            this.setState({currentIndex:this.state.currentIndex+1}, ()=>{
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if(gestureState.dx < -120){
          Animated.spring(this.position,{
            toValue:{x: -SCREEN_WIDTH-100,y:gestureState.dy}
          }).start(()=>{
            this.setState({currentIndex:this.state.currentIndex+1}, ()=>{
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  renderCards = () => {
    
    return Cards.map((item, i) => {

      if( i < this.state.currentIndex)
      {
        return null
      }
      else if( i == this.state.currentIndex)
      {
      return (
          <Animated.View 
            {...this.PanResponder.panHandlers}
            key={item.id}
            style={[this.rotateTranslate, styles.card]} 
          >
            <Image 
              source={item.uri}
              style={styles.image} 
            />
          </Animated.View>
      )
    }
      else
      {
        return (
          <Animated.View 
            key={item.id}
            style={[{opacity:this.nextCardOpacity,
            transform:[{scale:this.nextCardScale}]
            }, styles.card]} 
          >
            <Image 
              source={item.uri}
              style={styles.image} 
            />
          </Animated.View>
        )
      }
    }).reverse()
  }
  
  render () {
    return (
      <View style={styles.container}>
        {this.renderCards()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005FA7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    height: SCREEN_HEIGHT-120,
    width: SCREEN_WIDTH,
    borderColor: '#000',
    padding: 10,
    position: 'absolute',
    marginTop: 60
  },
  image: {
    flex:1,
    borderRadius: 20,
    resizeMode: 'cover',
    width: null,
    height: null
  }
})
