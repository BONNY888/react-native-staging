import React from 'react'
import { View, Button, alert, Text, StyleSheet, Share, WebView } from 'react-native'
import createInvoke from 'react-native-webview-invoke/native'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      message: 'hahahaha'
    };
    
  }
  // webInitialize = () => {
    
  // }
  webWannaGet = () => {
    return 'haha!!'
  }
  webWannaSet = (data) => {
    this.setState({ message: data })
  }
  
  invoke = createInvoke(() => this.webview)
  componentDidMount() {
    this.invoke
      // .define('init', this.webInitialize)
      .define('get', this.webWannaGet)
      .define('set', this.webWannaSet)
  }
  webview: WebView

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
          <Text>{this.state.message}</Text>
          </View> */}
          <WebView
            injectedJavaScript={patchPostMessageJsCode}
            ref={w => this.webview = w}
            // source={require('./index.html')}
            source={{uri: 'https://ee9c318d.ngrok.io'}}
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