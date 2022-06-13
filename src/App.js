import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import * as Colors from './assests/colors';
import * as Notifications from 'expo-notifications';
import EventStack from './navigation/StackNavigation';

function App() {
  LogBox.ignoreAllLogs();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldSetBadge: true,
        shouldPlaySound: true,
      }),
    });
  }, []);

  return (
    <NavigationContainer>
      <EventStack />
    </NavigationContainer>
  );
}

export default App;
