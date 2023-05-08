import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Timer } from 'react-native-stopwatch-timer';
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
        containerStyle={styles.stopWatchStyl}
        textCharStyle={styles.stopWatchChar}
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopWatchStyl: {
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
  stopWatchChar: {
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

  

//   const [isPlaying, setIsPlaying] = useState(true);
//   const convertingTimeToMinutes=Number(DurationOfRun)*60
  //   const [currentValueTimerIsOn, setCurrentValueTimerIsOn]=useState(0)

    
  // const togglePauseStart = () => {
  //   setIsPlaying(!isPlaying);
  // };
  // const [done,setDone]=useState(false)


  // const onFinish = () => {
  //   const elapsedTime = convertingTimeToMinutes - getRemainingTime();
  //   console.log(elapsedTime);
  //   navigation.navigate('FinishScreen', { elapsedTime: elapsedTime });
  // };


//   return(
  //     <View style={{flex:1, alignItems:'center'}}>
  //   <CountdownCircleTimer
  //       isPlaying={isPlaying}
  //       duration={convertingTimeToMinutes}
  //       colors={['#004777', '#F7B801', '#A30000', '#A30000']}
  //       colorsTime={[convertingTimeToMinutes, Math.round((convertingTimeToMinutes/4)*3), Math.round((convertingTimeToMinutes/2)), Math.round((convertingTimeToMinutes/4))]}
  //       onComplete={()=>{
  //         setDone(true)
  //       }}
  // >
    
  //   {
  //   ({ remainingTime }) => {
      
  //     return <Text style={{fontSize:50}}>{remainingTime}</Text>
  //   }
  //   }

  // </CountdownCircleTimer>

  // <Button title={isPlaying ? 'Pause' : 'Start'} onPress={togglePauseStart} /> 
  // {
  //   done&&(
  //     <Text>Congrats you have completed the exrercise!</Text>
  //   )
  // }

  // <Button 
  //   title="Finish"
  //   onPress={()=>{
  //     onFinish()

  //   }}
  // />