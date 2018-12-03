import React from 'react'
import { View, Button, Alert, Text, StyleSheet, Share, WebView, BackHandler } from 'react-native'
import createInvoke from 'react-native-webview-invoke/native'
var Geolocation = require('Geolocation');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      message: 'Get Geolocation',
      location: {}
    };
  }
  webview: WebView
  invoke = createInvoke(() => this.webview)
  // webInitialize = () => {
    
  // }
  webWannaGet = () => {
    return this.state.location;
  }
  webWannaSet = (data) => {
    this.setState({ message: data })
  }

  handleBackPress = () => {
    this.webview.goBack();
    return true  ;
  }
  
  componentDidMount() {
    this.invoke
      // .define('init', this.webInitialize)
      .define('get', this.webWannaGet)
      .define('set', this.webWannaSet)

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getLocation();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }


  //get geolocation
  getLocation() {
    Geolocation.getCurrentPosition(
        location => {
            var coords = {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude
            }
            this.setState(previousState => (
              { location: coords }
            ))
        },
        error => {
          Alert.alert("获取位置失败："+ error)
        }
    );
 }


  render() {
    const patchPostMessageFunction = function() {
        var originalPostMessage = window.postMessage;
    
        var patchedPostMessage = function(message, targetOrigin, transfer) {
            originalPostMessage(message, targetOrigin, transfer);
        };
    
        patchedPostMessage.toString = function() {
            return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
        };
    
        window.postMessage = patchedPostMessage;
    };
    
    const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
      return (
        <View
          style={{
            flex: 1
          }}>
          {/* <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Text style={styles.item} onPress={this.getLocation.bind(this)}>{this.state.message}</Text>
          </View> */}
          <WebView
            injectedJavaScript={patchPostMessageJsCode}
            ref={w => this.webview = w}
            // source={require('./index.html')}
            source={{uri: 'https://b98f0326.ngrok.io'}}
            onMessage={this.invoke.listener}
            style={styles.container} />
        </View>
      )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})