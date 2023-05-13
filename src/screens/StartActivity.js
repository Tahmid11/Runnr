import React, { useState,  useRef } from 'react';
import {Text,View,TouchableOpacity,SafeAreaView,StyleSheet,Alert} from 'react-native';
import { useRoute } from '@react-navigation/native';
import StopwatchTimer from 'react-native-animated-stopwatch-timer';
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 



const StartActivity = ({ navigation }) => {
  const route = useRoute();
  const UniqueID = route.params?.UniqueID;
  const DurationOfRun = route.params?.DurationOfRun;
  const currentDate = route.params?.currentDate;
  const dateOfOriginalRun= route.params?.dateOfOriginalRun;
  const timeOfOriginalRun= route.params?.timeOfOriginalRun;
  const postCode=route.params?.postCode;
  
  const [timerDuration, setTimerDuration] = useState((Number(DurationOfRun) * 1000)*60);

  const stopwatchRef=useRef()

  const handleFinish=()=>{
    stopwatchRef.current?.pause()
    let userTime=stopwatchRef.current?.getSnapshot();
    let elapsedTime=timerDuration-userTime

    console.log('This is the current date', currentDate)

    console.log('stopped time: ', userTime)
    console.log(timerDuration)
    console.log('user completed time: ',elapsedTime)

    if(userTime>=0){
      Alert.alert(
        "Confirm Run",
        "Do You Want To Confirm This Run?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {
              navigation.navigate('FinishScreen',{
                totalActivityTime:elapsedTime,
                DurationOfRun:timerDuration,
                UniqueID:UniqueID,
                currentDate:currentDate,
                originalDateOfRun:dateOfOriginalRun,
                timeOfOriginalRun:timeOfOriginalRun,
                postCode:postCode
              })
              
            }
          }
        ],
      );

    }
    else{
      navigation.navigate('FinishScreen',{})

    }

   

  }

  return (
    <SafeAreaView style={styles.container}>

      <StopwatchTimer
        ref={stopwatchRef}
        initialTimeInMs={(DurationOfRun * 1000) *60}
        textCharStyle={styles.numberForStopWatch}
        containerStyle={styles.theStyleOfCountdown}
        trailingZeros={2}
      />

      <View style={{flexDirection:'row'}}>
      <TouchableOpacity
        onPress={()=>{
          stopwatchRef.current?.play()
        }}
        style={styles.button}
      >
        <Feather style={{justifyContent:'center'}}name="play" size={40} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={()=>{
          handleFinish()
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    <TouchableOpacity
        style={styles.button}
    
        onPress={()=>{
          stopwatchRef.current?.pause()
        }}
      >
        <AntDesign name="pause" size={40} color="white" />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StartActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 11,
  },
  theStyleOfCountdown: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    backgroundColor: '#346eeb',
    borderColor: 'white',
    borderRadius: 90,
    width:350,
    bottom:190
  },
  numberForStopWatch: {
    fontSize: 41,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  button: {
    backgroundColor: '#346eeb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 1,
    width: 70,
    height: 70,
    marginHorizontal:30
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

  

