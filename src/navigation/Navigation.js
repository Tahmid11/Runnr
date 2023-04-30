
import React,{useState,useEffect} from 'react';
import { View,  Dimensions, Keyboard} from 'react-native';
// Navigation
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


// Importing the different screens.
import Match from '../screens/Match';
import Setting from '../screens/Settings';
import EditProfile from '../screens/EditProfile';
import Message from '../screens/MessageScreen';
import Activity from '../screens/Activity';
import Login from '../screens/Login';
import PopupSreen from '../screens/PopupScreen';
import Conversation from '../screens/ConversationScreen';
import callingContext from '../components/callingContext';
import { NavigationContainer } from '@react-navigation/native';


import Icon from 'react-native-vector-icons/Entypo'




// Creating the different navigation.
const bottomTabs = createBottomTabNavigator();
const EdittingProfile=createNativeStackNavigator();
const loginStackNav=createNativeStackNavigator();
const modalScreenPopUpNav=createNativeStackNavigator();
const messageStackNav=createNativeStackNavigator()
// Creation of stack navigator for setting and editing profile page.
const SettingScreen=()=>{
  return(
  <EdittingProfile.Navigator>
    <EdittingProfile.Screen name='SettingScreen' component={Setting} options={{title:'Setting'}}/>
    <EdittingProfile.Screen name='edit' component={EditProfile}  
    options={({ route }) => ({
      title: "Edit Profile",
      headerLeft:
        route.params?.disableBackButton || !route.params?.succesfulPosting
          ? null
          : undefined,
    })}/>
  </EdittingProfile.Navigator>
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

const MessageScreen=()=>{
  return(
    <messageStackNav.Navigator>
      <messageStackNav.Screen name='Chats' component={Message}  options={{title:'Chats', headerTitleAlign:'center'}}/>
      <messageStackNav.Screen name='Conversation' component={Conversation} 
     
     options={({ route }) => ({
          title: route.params?.nameOfPerson || "Conversation",
          picture:route.params?.pictureOfTheOtherPerson
        })}
          
          />
    </messageStackNav.Navigator>
  )
}

// Bottom tab navigator.
export default function Navigation() {
  const { width, height } = Dimensions.get("window")


  const { user } = callingContext();


  return (
    
    <NavigationContainer >
      {/* HOC; surrounding the children and passing data from the parent to the children.  */}
      {user ?(
          <bottomTabs.Navigator
          options={{ keyboardHidesTabBar: true, tabBarStyle: [{ display: 'flex' }, null] }}
        >
          <bottomTabs.Screen name='Match' component={ModalScreen} options={{headerShown:false}}/>
          <bottomTabs.Screen name='Message'  component={MessageScreen} options={{ 
            tabBarIcon: () => <Icon name="chat"  size={27} /> ,headerShown:false}} />
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


