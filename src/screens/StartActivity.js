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

const StartActivity = ({ navigation }) => {
  const route = useRoute();
  const UniqueID = route.params?.UniqueID;
  const DurationOfRun = route.params?.DurationOfRun;
  const currentDate = route.params?.currentDate;
  const dateOfOriginalRun= route.params?.dateOfOriginalRun;
  const timeOfOriginalRun= route.params?.timeOfOriginalRun;
  const postCode=route.params?.postCode;
  
  const [isTimerStart, setIsTimerStart] = useState(false);
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

    if(userTime>0){
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
      <Button
        title='Starts'
        onPress={()=>{stopwatchRef.current?.play()}}
      />

      <Button
        title='Finish'
        onPress={handleFinish}
      />

      <Button 
      title='Pause'
      onPress={()=>{stopwatchRef.current?.pause()}}
      
      />



      {/* <View style={styles.sectionStyle}> */}
        {/* <Timer
          totalDuration={timerDuration}
          msecs
          start={isTimerStart}
          options={options}
          handleFinish={() => {
            alert('Custom Completion Function');
          }}
          getTime={(time) => {
            console.log(time);
          }}
        /> */}
      {/* </View> */}
      {/* <TouchableHighlight
        onPress={() => {
          setIsTimerStart(!isTimerStart);
        }}>
        <Text style={styles.buttonText}>
          {!isTimerStart ? 'START' : 'STOP'}
        </Text>
      </TouchableHighlight> */}
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
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 24,
  },
  stopWatchChar: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#9CCC65',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  sectionStyle: {
    flex: 1,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 20,
    marginTop: 10,
  },
});

const options = {
  container: {
    backgroundColor: '#FF0000',
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    color: '#FFF',
    marginLeft: 7,
  },
};



  

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