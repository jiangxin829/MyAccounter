import React, { Component } from 'react'
import { Image, View, TextInput, Button } from 'react-native'
//导入container导航栏
import { createAppContainer } from 'react-navigation'
//导入导航栏Stack
import { createStackNavigator } from 'react-navigation-stack';
//导入底部导航栏组件
import { createBottomTabNavigator } from 'react-navigation-tabs'

//LoginPage
import LoginPage from './page/login/loginPage'

//BottomNavigation
import AccountingPage from './page/accounting/accountingPage'
import MinePage from './page/mine/minePage'

//AccountingPage
import SearchPage from './page/accounting/search/searchPage'
import AnalysePage from './page/accounting/analyse/analysePage'
import TypeDetailPage from './page/accounting/analyse/typeDetailPage'

//MinePage
import UserInfoPage from './page/mine/userInfo/userInfoPage'
import TeachingPage from './page/mine/teaching/teachingPage'
import WalletPage from './page/mine/wallet/walletPage'
import TransferAccountPage from './page/mine/wallet/transfer/transferAccountPage'
import WalletAccountPage from './page/mine/wallet/walletAccount/walletAccountPage'
import WalletAccountSettingPage from './page/mine/wallet/walletAccount/walletAccountSettingPage'
import ConsumeDetailPage from './page/mine/wallet/walletAccount/consumeDetailPage'
import NewAccountPage from './page/mine/wallet/newAccount/newAccountPage'
import ChooseAccountTypePage from './page/mine/wallet/newAccount/chooseAccountTypePage'
import ReminderPage from './page/mine/reminder/reminderPage'
import SettingPage from './page/mine/setting/settingPage'
import AboutPage from './page/mine/about/aboutPage'
import UserPasswordPage from './page/mine/setting/userPasswordPage'

import { Heading1, styles_common, Paragraph } from './assets/js/CommonStyles'
import AsyncStorage from '@react-native-community/async-storage'
import { Toast, Provider } from '@ant-design/react-native'

//底部TabBar Navigator
const BottomTabNavigator = createBottomTabNavigator(
  {
    Accounting: { 
      screen: AccountingPage,
      navigationOptions: {
          title: '记账',
          tabBarLabel: '记账',  
      } 
    },
    Mine: { 
      screen: MinePage,
      navigationOptions: {
          title: '我的',
          tabBarLabel: '我的',
      } 
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      //taBar图标
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Accounting') {
          if (focused) {
            return (
                <Image style={{width: 30,height: 30,}} source={require('./assets/img/account0.png')}/>
            );
          }
          return (
              <Image style={{width: 30,height: 30,}} source={require('./assets/img/account1.png')}/>
          );
        } else if (routeName === 'Mine') {
          if (focused) {
            return (
                <Image style={{width: 30,height: 30,}} source={require('./assets/img/mine0.png')}/>
            );
          }
          return (
              <Image style={{width: 30,height: 30,}} source={require('./assets/img/mine1.png')}/>
          );
        }
      },
    }),
    //taBar文字两种状态颜色
    tabBarOptions: {
        activeTintColor: '#EEBF30',
        inactiveTintColor: '#BEC2CA',
    },
    initialRouteName: 'Accounting'
  }
)

const RootStack = createStackNavigator(
  {
    BottomTabNavigator: {screen: BottomTabNavigator},

    Login: {screen: LoginPage},

    //Accounting 页面
      //搜索页面
      Search: {screen: SearchPage},
      //分析页面
      Analyse: {screen: AnalysePage},
      //分析类型分类详情页面
      TypeDetail: {screen: TypeDetailPage},
    //Mine 页面
      //个人信息
      UserInfo: {screen: UserInfoPage},
      //调教页面
      Teaching: {screen: TeachingPage},
      //我的钱包
      Wallet: {screen: WalletPage},
        //转账页面
        TransferAccount: {screen: TransferAccountPage},
        //钱包单个账户页面
        WalletAccount: {screen: WalletAccountPage},
          //单个账户设置页面(NewAccountPage共用)
          WalletAccountSetting: {screen: WalletAccountSettingPage},
          //账户每笔消费页面(AccountPage共用) 未书写
          ConsumeDetail: {screen: ConsumeDetailPage},
        //选择账户类型页面
        ChooseAccountType: {screen: ChooseAccountTypePage},
          //新建账户页面
          NewAccount: {screen: NewAccountPage},
      //记账提醒
      Reminder: {screen: ReminderPage},
      //设置
      Setting: {screen: SettingPage},
        //修改密码页面
        UserPassword: {screen: UserPasswordPage},
      //关于APP
      About: {screen: AboutPage},
  },
  {
    headerMode: 'none',
  }
);


//create AppContainer
//AppContainer里是BottomTabNavigator和MainStack,包含了所有APP登录后的内容
const AppContainer = createAppContainer(RootStack);

// const AuthContext = React.createContext();

// function SplashScreen() {
//   return (
//     <View style={[styles_common.columnCenterCenter, styles_common.containerWhite]}>
//         <Image source={require('./assets/img/MyAccounter.png')} style={{width: 200, height: 200}}/>
//         <Heading1>MyAccounter</Heading1>
//         <Paragraph>Loading...</Paragraph>
//         <View style={{height: 100}}/>
//     </View>
//   );
// }

// // function HomeScreen() {
// //   const { signOut } = React.useContext(AuthContext);

// //   return (
// //     <View>
// //       <Text>Signed in!</Text>
// //       <Button title="Sign out" onPress={signOut} />
// //     </View>
// //   );
// // }

// function SignInScreen() {
//   const [username, setUsername] = React.useState('');
//   const [password, setPassword] = React.useState('');

//   const { signIn } = React.useContext(AuthContext);

//   return (
//     <View>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Sign in" onPress={() => signIn({ username, password })} />
//     </View>
//   );
// }

// const Stack = createStackNavigator();

// export default function App({ navigation }) {
//   const [state, dispatch] = React.useReducer(
//     (prevState, action) => {
//       switch (action.type) {
//         case 'RESTORE_TOKEN':
//           return {
//             ...prevState,
//             userToken: action.token,
//             isLoading: false,
//           };
//         case 'SIGN_IN':
//           return {
//             ...prevState,
//             isSignout: false,
//             userToken: action.token,
//           };
//         case 'SIGN_OUT':
//           return {
//             ...prevState,
//             isSignout: true,
//             userToken: null,
//           };
//       }
//     },
//     {
//       isLoading: true,
//       isSignout: false,
//       userToken: null,
//     }
//   );

//   React.useEffect(() => {
//     // Fetch the token from storage then navigate to our appropriate place
//     const bootstrapAsync = async () => {
//       let userToken;

//       try {
//         userToken = await AsyncStorage.getItem('userToken');
//       } catch (e) {
//         // Restoring token failed
//       }

//       // After restoring token, we may need to validate it in production apps

//       // This will switch to the App screen or Auth screen and this loading
//       // screen will be unmounted and thrown away.
//       dispatch({ type: 'RESTORE_TOKEN', token: userToken });
//     };

//     bootstrapAsync();
//   }, []);

//   const authContext = React.useMemo(
//     () => ({
//       signIn: async data => {
//         // In a production app, we need to send some data (usually username, password) to server and get a token
//         // We will also need to handle errors if sign in failed
//         // After getting token, we need to persist the token using `AsyncStorage`
//         // In the example, we'll use a dummy token

//         dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
//       },
//       signOut: () => dispatch({ type: 'SIGN_OUT' }),
//       signUp: async data => {
//         // In a production app, we need to send user data to server and get a token
//         // We will also need to handle errors if sign up failed
//         // After getting token, we need to persist the token using `AsyncStorage`
//         // In the example, we'll use a dummy token

//         dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
//       },
//     }),
//     []
//   );

//   return (
//     <AuthContext.Provider value={authContext}>
//       <NavigationContainer>
//         <Stack.Navigator>
//           {state.isLoading ? (
//             // We haven't finished checking for the token yet
//             <Stack.Screen name="Splash" component={SplashScreen} />
//           ) : state.userToken == null ? (
//             // No token found, user isn't signed in
//             <Stack.Screen
//               name="SignIn"
//               component={SignInScreen}
//               options={{
//                 title: 'Sign in',
//             // When logging out, a pop animation feels intuitive
//                 animationTypeForReplace: state.isSignout ? 'pop' : 'push',
//               }}
//             />
//           ) : (
//             // User is signed in
//             <AppContainer/>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </AuthContext.Provider>
//   );
// }

//export App

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        isLoading: true,
        isSignedOut: true
    }
  }

  //获取服务器数据&更新本地存储数据
  getUserData(user) {
    fetch('http://192.168.43.2:3000/login', {
      method: 'POST',
      headers: {
          // Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          nickName: user.nickName,
          password: user.password
      }),
      })
          .then(res=>res.json())
          .then(async (data)=>{
              if(data.user=='') {
                  Toast.fail('请重新登录',0.5);
                  this.setState({isSignedOut: true, isLoading: false});
              } else {
                  //Toast.success(data.user.nickName+'登录成功',0.1);
                  this.setState({isSignedOut: false, isLoading: false});
                  //更新本地存储
                  await AsyncStorage.setItem('user', JSON.stringify(data.user));
                  await AsyncStorage.setItem('accounts', JSON.stringify(data.accounts));
                  await AsyncStorage.setItem('deals', JSON.stringify(data.deals));
              }
          })
          .catch((error) => {
              Toast.offline('服务器出错了',0.5,()=>{},true);
              console.error(error);
          });
  }

  //检查本地是否存储用户登录信息
  checkSignedOut = async () => {
    let user = {};
    try {
      user = await AsyncStorage.getItem('user');
      //console.warn(user);
    } catch (e) {
      console.error(e);
    }
    if(user==null) {
      this.setState({isSignedOut: true, isLoading: false});
    } else {
      this.getUserData(JSON.parse(user));
    }
  }

  render() {
    if(this.state.isLoading){
      //await AsyncStorage.clear();
      setTimeout(()=>{
        
        this.checkSignedOut();
      }, 1000)
      return(
         <Provider>
            <View style={[styles_common.columnCenterCenter, styles_common.containerWhite]}>
              <Image source={require('./assets/img/MyAccounter.png')} style={{width: 200, height: 200}}/>
              <Heading1>MyAccounter</Heading1>
              <View style={{height: 100}}/>
           </View>
         </Provider>
      )
    }

    return(
      <Provider>
        {this.state.isSignedOut?<LoginPage/>:<AppContainer />}
      </Provider>
    )
  }
}
