
import React from 'react';
import { View } from 'react-native';
// Navigation
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importing the different screens.
import Match from '../screens/Match';
import Setting from '../screens/Settings';
import EditProfile from '../screens/EditProfile';
import Message from '../screens/MessageScreen';
import Activity from '../screens/Activity';
import Login from '../screens/Login';
import PopupSreen from '../screens/PopupScreen';

import callingContext from '../components/callingContext';
import { NavigationContainer } from '@react-navigation/native';


import Icon from 'react-native-vector-icons/Entypo'


// Creating the different navigation.
const bottomTabs = createBottomTabNavigator();
const editProfile=createNativeStackNavigator();
const loginStackNav=createNativeStackNavigator();
const modalScreenPopUpNav=createNativeStackNavigator();
// Creation of stack navigator for setting and editing profile page.
const SettingScreen=()=>{
  return(
  <editProfile.Navigator>
    <editProfile.Screen name='SettingScreen' component={Setting} options={{title:'Setting'}}/>
    <editProfile.Screen name='EditProfile' component={EditProfile} options={{title:'Edit Profile'}}/>
  </editProfile.Navigator>
  )
};

const LoginScreen=()=>{
  return(
    <loginStackNav.Navigator>
      <loginStackNav.Screen name='Login' component={Login}/>
    </loginStackNav.Navigator>
  )
}

const ModalScreen=()=>{
  return(
  <modalScreenPopUpNav.Navigator>
    <modalScreenPopUpNav.Screen name='MatchScreen' component={Match} options={{title:'Match'}}/>
    <modalScreenPopUpNav.Screen name='PopUpScreen' component={PopupSreen} options={{
        presentation: 'modal'
      }}/>
  </modalScreenPopUpNav.Navigator>)
}

// Bottom tab navigator.
export default function Navigation() {
  const {user}=callingContext();
  // console.log(ifUserHasLoggedIn())

  return (
  
    <NavigationContainer>
      {/* HOC; surrounding the children and passing data from the parent to the children.  */}
      {user ?(
          <bottomTabs.Navigator>
          <bottomTabs.Screen name='Match' component={ModalScreen} options={{headerShown:false}}/>
          <bottomTabs.Screen name='Message' component={Message} options={{ tabBarIcon: () => <Icon name="chat"  size={27} />}} />
          <bottomTabs.Screen name='Activity' component={Activity}/>
          <bottomTabs.Screen name='Setting' options={{title:'Settings',headerShown:false}} component={SettingScreen} />
          </bottomTabs.Navigator>
       ):( 
        <View style={{ flex: 1 }}>
        <LoginScreen/>
        </View> 
      )} 
      </NavigationContainer>
  )
};
