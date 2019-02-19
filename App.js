import React from 'react'
import { View, Button, Alert, StyleSheet, Text, WebView, BackHandler, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import createInvoke from 'react-native-webview-invoke/native';
import { Constants } from 'expo';
var Geolocation = require('Geolocation');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      message: 'Get Geolocation',
      location: {},
      showBackButton: false,
      showFooter: false,
      showHeader: true,
      showLOGO: false,
      // url: 'https://ac9a8d3c.ngrok.io/',
      // originURL: 'https://ac9a8d3c.ngrok.io/',
      url: 'https://staging.bonnylive.biz/',
      originURL: 'https://staging.bonnylive.biz/',
      footerChangeURL: '',
      nowURL: '',
      key: 0,
      path: '',
      loading: false,
      isBadminton: false
    };
  }
  webview: WebView
  invoke = createInvoke(() => this.webview)
  // webInitialize = () => {
    
  // }
  webWannaGet = () => {
    const data = {
      location: this.state.location,
      statusBarHeight: Constants.statusBarHeight,
      platform: Constants.platform
    }
    return data;
  }

  handleBackPress = () => {
    this.webview.goBack();
    return true  ;
  }

  navStateChange = (state) => {
    state.url.split(':')[0] == 'https' && this.setState({
      // loading: state.loading,
      loading: true,
      nowURL: state.url,
      isBadminton: state.url.includes(this.state.originURL)
    })
    // this.state.isBadminton && this.setState({showHeader: true})
    this.setState({
      showBackButton: !this.state.isBadminton,
      showFooter: !this.state.isBadminton,
      showLOGO: false
    })
    state.url == "https://staging.bonnylive.biz/Login" ? false : state.url != this.state.url && this.setState({
      url: state.url,
      key: this.state.key + 1
    })
    setTimeout(() => {
      this.setState({
        loading: false,
        showHeader: false,
        // showLOGO: this.state.nowURL.includes(this.state.originURL)
      })
    }, 1000)
    state.url.split(':')[0] == 'https' && console.log(this.state, state)
  }

  componentDidMount() {
    this.invoke
      .define('get', this.webWannaGet)
    
    this.getPath();
      
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getLocation();
  }
    
    getPath = () => {
      const set = this.invoke.bind('set')
      set().then(function(data) {
      });
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
    const backButton = <View
    style={{
      position: 'absolute',
      bottom: 73,
      left: 0,
      width: '100%',
      height: 35,
      backgroundColor: '#c30d22',
      zIndex: 10
    }}>
    <Button
      onPress={this.handleBackPress}
      title="< Back"
      color="#ffffff"
    />
  </View>;

  const loading = <View
  style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 99
  }}>
    <View
      style={{
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      borderRadius: 10
    }}>
      <ActivityIndicator size="large" color="#da263c" />
      <Text
      style={{color: '#ffffff', marginTop: 20}}>載入中...</Text>
    </View>
  </View>

  const logo = <TouchableOpacity
  style={{
    position: 'absolute',
    top: (Constants.statusBarHeight + 3),
    width: 140,
    height: 57,
    alignSelf: 'center',
    paddingLeft: 2,
    zIndex: 10
  }}
  onPress={()=> {
    this.setState({
      url: this.state.originURL,
      key: this.state.key + 1
    })
  }}>
    <Image 
      source={require('./assets/LOGO.png')} 
      style={{width: 136, height: 54}} />
  </TouchableOpacity>

  const header = <View
  style={{
    position: 'absolute',
    top: (Constants.statusBarHeight),
    width: '100%',
    height: 57,
    left: 0,
    zIndex: 10
  }}>
    <View
    style={{
      position: 'relative',
      width: '100%',
      height: 57,
      backgroundColor: 'rgb(218, 38, 60)',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}>
      <Image 
      source={require('./assets/LOGO.png')} 
      style={{width: 136, height: 54}} />
      <Image 
      source={require('./assets/menu.png')} 
      style={{
        height: 26,
        position: 'absolute',
        right: 16,
        top: 14}} />
    </View>
  </View>

  const footer = <View
  style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    height: 73,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(218, 38, 60)',
    zIndex: 10
  }}>
    <TouchableOpacity
        style={styles.footer_nav_content}
      onPress={()=> {
        console.log('jump!!!!', this.state.key)
        this.state.url != 'https://staging.bonnylive.biz/activitySignUp' && this.setState({
          loading: true,
          showHeader: true,
          url: 'https://staging.bonnylive.biz/activitySignUp',
          footerChangeURL: 'https://staging.bonnylive.biz/activitySignUp',
          key: this.state.key + 1
        })
      }}>
      <Image source={require('./assets/SignUpMenu.png')} style={{width: 40, height: 40}} />
      <Text
        style={styles.footer_nav_text}
      >臨打報名</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={styles.footer_nav_content}
      onPress={()=> {
        console.log('jump!!!!', this.state.key)
        this.state.url != 'https://staging.bonnylive.biz/newGroup' && this.setState({
          loading: true,
          showHeader: true,
          url: 'https://staging.bonnylive.biz/newGroup',
          footerChangeURL: 'https://staging.bonnylive.biz/newGroup',
          key: this.state.key + 1
        })
      }}>
      <Image source={require('./assets/GroupMenu.png')} style={{width: 40, height: 40}} />
      <Text
        style={styles.footer_nav_text}
      >開團找我</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footer_nav_content}
        onPress={()=> {
          console.log('jump!!!!', this.state.key)
          this.state.url != 'https://www.bonny-live.com/WebDocument/SportCategory' && this.setState({
            loading: true,
            showLOGO: false,
            url: 'https://www.bonny-live.com/WebDocument/SportCategory',
            footerChangeURL: 'https://www.bonny-live.com/WebDocument/SportCategory',
            key: this.state.key + 1
          })
        }}>
      <Image source={require('./assets/KnowHowMenu.png')} style={{width: 40, height: 40}} />
      <Text
        style={styles.footer_nav_text}
      >羽球知識家</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footer_nav_content}
        onPress={()=> {
          this.state.url != 'https://www.bonny-live.com/Live/List' && this.setState({
            loading: true,
            showLOGO: false,
            url: 'https://www.bonny-live.com/Live/List',
            footerChangeURL: 'https://www.bonny-live.com/Live/List',
            key: this.state.key + 1
          })
          console.log('jump!!!!', this.state)
        }}>
      <Image source={require('./assets/HotLiveMenu.png')} style={{width: 40, height: 40}} />
      <Text
        style={styles.footer_nav_text}
      >Live直播</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footer_nav_last_content}
        onPress={()=> {
          this.state.url != 'https://staging.bonnylive.biz/myInfo' && this.setState({
            loading: true,
            showHeader: true,
            url: 'https://staging.bonnylive.biz/myInfo',
            footerChangeURL: 'https://staging.bonnylive.biz/myInfo',
            key: this.state.key + 1
          })
          console.log('after', this.state)
        }}>
      <Image source={require('./assets/MyBonnyMenu.png')} style={{width: 40, height: 40}} />
      <Text
        style={styles.footer_nav_text}
      >My Bonny</Text>
      </TouchableOpacity>
  </View>;

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
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          alignContent: 'center',
          justifyContent: 'center'
        }}>
        {this.state.showBackButton && Object.keys(Constants.platform)[0] == 'ios' && backButton}
        {this.state.showFooter && footer}
        {this.state.loading && loading}
        {this.state.showHeader && header}
        {this.state.showLOGO && logo}
          <StatusBar
            barStyle="light-content"
          />
          <View
          style={{
            backgroundColor: "black",
            height: Constants.statusBarHeight
          }}></View>
          <WebView
            injectedJavaScript={patchPostMessageJsCode}
            ref={w => this.webview = w}
            source={{uri: this.state.url}}
            onMessage={this.invoke.listener}
            style={styles.container}
            onNavigationStateChange={this.navStateChange.bind(this)}
            scrollEnabled={false}
            />
        </View>
      )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer_nav_content: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ffffff'
  },
  footer_nav_last_content: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer_nav_text: {
    color: "#ffffff",
    fontSize: 10,
    paddingTop: 3
  }
})