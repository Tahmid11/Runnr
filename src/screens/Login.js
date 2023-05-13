import React from "react";
import { Text,View,Button, TouchableOpacity, StyleSheet } from "react-native";
import callingContext from "../components/callingContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Login = ({navigation}) => {
  const { onGoogleButtonPress, setLoading,isLoading, user} = callingContext();
  const handleGoogleSignIn = async () => {
    console.log('This is the loading value currently: ' + isLoading)
    try {
      await onGoogleButtonPress();
      console.log('This is the value currently in Loading in Login.js :' + isLoading)
      console.log('Signed in with Google!');
      await setLoading(false);
      console.log('What is isLoading right now after logging in: ', isLoading);
    } catch (error) {
      console.log('Error signing in with Google:', error);
      // Handle the error here, e.g. show an error message to the user
      setLoading(false)
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={{alignItems: 'center'}}><MaterialCommunityIcons name="run" size={300} color="white" /></Text> 
      <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>Runnr</Text>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.button}>
        <Text style={styles.font}>Google Signin Button</Text>
      </TouchableOpacity>
    </View>
  );
};




const styles=StyleSheet.create({
  wrap:{
    flex:1,
    alignItems:"center",
    justifyContent:'center', 
    marginBottom:30,
    backgroundColor:'#346eeb'
  },
  button:{
    overflow: 'hidden',
    alignItems:"center",
    justifyContent:"flex-end",
    
    backgroundColor:'white',
    borderRadius:15,
    paddingHorizontal:10,
    paddingVertical:10

    
  },
  font:{
    fontSize:20,
    fontWeight:"bold",
    textAlign:"center"

  }



})

export default Login;