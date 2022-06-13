import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Colors from '../../assests/colors';
import moment from 'moment';
import uuid from 'react-native-uuid';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';

const CreateEvent = ({ navigation, route }) => {
  const [eventData, setEventData] = useState([]);
  const [eventTitle, setEventTile] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState(new Date().getTime() + 900000);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [timeMode, setTimeMode] = useState('start');
  const [editId, setEditId] = useState(-1);

  React.useEffect(() => {
    getEventData();
  }, []);

  const EditData = async (eventData) => {
    for (var i = 0; i < eventData.length; i++) {
      if (eventData[i].id == route.params.id) {
        setEventTile(eventData[i].title);
        setEventDescription(eventData[i].description);
        setEventType(eventData[i].type);
        setEditId(i);
        setDate(new Date(eventData[i].dateTime));
        setStartTime(new Date(eventData[i].dateTime).getTime());
        setEndTime(new Date(eventData[i].dateTime).getTime() + 900000);
      }
    }
  };

  const getEventData = async () => {
    const localData = await AsyncStorage.getItem('event_listing');

    if (localData != null) {
      setEventData(JSON.parse(localData));

      if (route.params.id) {
        EditData(JSON.parse(localData));
      }
    } else {
      setEventData([]);
    }
  };

  const onChange = (event, selectedDateOrTime) => {
    if (mode == 'date') {
      const currentDate = selectedDateOrTime;
      setShow(false);
      setDate(currentDate);
    } else if (mode == 'time') {
      if (timeMode == 'start') {
        const startTimes = new Date(selectedDateOrTime).getTime();
        setShow(false);
        setStartTime(startTimes);
      } else if (timeMode == 'end') {
        const endTimes = new Date(selectedDateOrTime).getTime();
        setShow(false);
        setEndTime(endTimes);
      }
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = (type) => {
    setTimeMode(type);
    showMode('time');
  };

  const CreateEventCall = async () => {
    const dateA = moment(date).format('YYYY-MM-DD');
    const dateB = moment(new Date()).format('YYYY-MM-DD');

    if (eventTitle == '' || eventTitle == null) {
      Alert.alert('Alert', 'Enter event title');
    } else if (
      moment(startTime).format('hh:mm a') == 'Invalid date' ||
      moment(endTime).format('hh:mm a') == 'Invalid date'
    ) {
      Alert.alert('Alert', 'Enter valid time');
    } else if (moment(dateA).isBefore(dateB)) {
      Alert.alert('Alert', 'Enter current or upcoming dates');
    } else if (startTime > endTime) {
      Alert.alert('Alert', 'Start time must be less than end time');
    } else if (eventData.length != 0) {
      var dateTimeStart =
        new Date(date).getTime() + startTime - new Date().getTime();
      var dateTimeEnd =
        new Date(date).getTime() + endTime - new Date().getTime();

      var check = true;

      for (var i = 0; i < eventData.length; i++) {
        if (
          new Date(eventData[i].dateTime).getTime() >=
            new Date(dateTimeStart).getTime() &&
          new Date(eventData[i].dateTime).getTime() <=
            new Date(dateTimeEnd).getTime()
        ) {
          Alert.alert('Alert', 'Trying to create event at the same time');
          check = false;
          break;
        }
      }

      if (check == true) {
        var arr = eventData;
        arr.push({
          id: uuid.v4(),
          title: eventTitle,
          description: eventDescription,
          type: eventType,
          dateTime: new Date(dateTimeStart),
        });

        const localData = JSON.stringify(arr);
        await AsyncStorage.setItem('event_listing', localData);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: eventTitle,
            body: eventDescription,
            sound: 'default',
          },
          trigger: {
            date: new Date(dateTimeStart - 600000),
          },
        });

        navigation.goBack();
      }
    } else if (eventData.length == 0) {
      var dateTimeStart =
        new Date(date).getTime() + startTime - new Date().getTime();

      var arr = eventData;
      arr.push({
        id: uuid.v4(),
        title: eventTitle,
        dateTime: new Date(dateTimeStart),
        description: eventDescription,
        type: eventType,
      });

      const localData = JSON.stringify(arr);
      await AsyncStorage.setItem('event_listing', localData);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: eventTitle,
          body: eventDescription,
          sound: 'default',
        },
        trigger: {
          date: new Date(dateTimeStart - 600000),
        },
      });

      navigation.navigate('EventListView');
    }
  };

  const EditEventCall = async () => {
    const dateA = moment(date).format('YYYY-MM-DD');
    const dateB = moment(new Date()).format('YYYY-MM-DD');

    if (eventTitle == '') {
      Alert.alert('Alert', 'Please enter event title');
    } else if (
      moment(startTime).format('hh:mm a') == 'Invalid date' ||
      moment(endTime).format('hh:mm a') == 'Invalid date'
    ) {
      Alert.alert('Alert', 'Please enter valid time');
    } else if (moment(dateA).isBefore(dateB)) {
      Alert.alert('Alert', 'Date should be either current date or above');
    } else if (startTime > endTime) {
      Alert.alert('Alert', 'Start time should be less than end time');
    } else if (eventData.length != 0) {
      var dateTimeStart =
        new Date(date).getTime() + startTime - new Date().getTime();
      var dateTimeEnd =
        new Date(date).getTime() + endTime - new Date().getTime();

      var check = true;

      for (var i = 0; i < eventData.length; i++) {
        if (
          new Date(eventData[i].dateTime).getTime() >=
            new Date(dateTimeStart).getTime() &&
          new Date(eventData[i].dateTime).getTime() <=
            new Date(dateTimeEnd).getTime()
        ) {
          Alert.alert('Alert', 'Start time should be less than end time');
          check = false;
          break;
        }
      }

      if (check == true) {
        var arr = eventData;
        arr.push({
          id: uuid.v4(),
          title: eventTitle,
          dateTime: new Date(dateTimeStart),
          description: eventDescription,
          type: eventType,
        });

        arr[editId] = arr[arr.length - 1];
        arr.pop();

        const localData = JSON.stringify(arr);
        await AsyncStorage.setItem('event_listing', localData);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: eventTitle,
            body: eventDescription,
            sound: 'default',
          },
          trigger: {
            date: new Date(dateTimeStart - 600000),
          },
        });

        navigation.navigate('EventListView');
      }
    } else if (eventData.length == 0) {
      var dateTimeStart =
        new Date(date).getTime() + startTime - new Date().getTime();

      var arr = eventData;
      arr.push({
        id: uuid.v4(),
        title: eventTitle,
        dateTime: new Date(dateTimeStart),
        description: eventDescription,
        type: eventType,
      });

      arr[editId] = arr[arr.length - 1];
      arr.pop();

      const localData = JSON.stringify(arr);
      await AsyncStorage.setItem('event_listing', localData);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: eventTitle,
          body: eventDescription,
          sound: 'default',
        },
        trigger: {
          date: new Date(dateTimeStart - 600000),
        },
      });

      navigation.navigate('EventListView');
    }
  };

  return (
    <SafeAreaView style={Styles.fullContainer}>
      <ScrollView>
        <View style={Styles.textInputView}>
          <TextInput
            value={eventTitle}
            placeholder="Name"
            placeholderTextColor={Colors.gray}
            onChangeText={setEventTile}
            style={{
              alignSelf: 'flex-start',
              marginVertical: 5,
              marginLeft: 10,
              color: Colors.olive,
            }}
          />
        </View>
        <View style={Styles.textInputView}>
          <TextInput
            onChangeText={setEventDescription}
            value={eventDescription}
            multiline={true}
            numberOfLines={4}
            placeholder="Description"
            placeholderTextColor={Colors.gray}
            style={{
              marginLeft: 10,
              alignSelf: 'flex-start',
              marginVertical: 5,
              color: Colors.olive,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={showDatepicker}
          style={{
            marginTop: hp(2),
            marginHorizontal: wp(3),
            alignItems: 'flex-start',
            borderColor: Colors.olive,
            borderWidth: 1,
            marginBottom: hp(1),
          }}
        >
          <Text style={{ marginVertical: hp(2), marginLeft: wp(2) }}>
            {moment(date).format('DD-MM-YYYY')}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={Styles.timeOpacityView}>
            <TouchableOpacity
              onPress={() => showTimepicker('start')}
              style={{
                alignItems: 'flex-start',
                borderColor: Colors.olive,
                borderWidth: 1,
                marginBottom: hp(1),
              }}
            >
              <Text style={{ marginVertical: hp(2), marginHorizontal: wp(3) }}>
                {moment(startTime).format('hh:mm a')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.timeOpacityView}>
            <TouchableOpacity
              onPress={() => showTimepicker('end')}
              style={{
                alignItems: 'flex-start',
                borderColor: Colors.olive,
                borderWidth: 1,
                marginBottom: hp(1),
              }}
            >
              <Text style={{ marginVertical: hp(2), marginLeft: wp(2) }}>
                {moment(endTime).format('hh:mm a')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={
              mode == 'date'
                ? new Date(date ? date : new Date())
                : mode == 'time' && timeMode == 'start'
                ? new Date(startTime ? startTime : new Date().getTime())
                : new Date(endTime ? endTime : new Date().getTime() + 900000)
            }
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <View style={Styles.buttonView}>
          <Picker
            style={{ color: Colors.white }}
            dropdownIconColor={Colors.white}
            selectedValue={eventType}
            onValueChange={(itemValue) => {
              setEventType(itemValue);
            }}
          >
            <Picker.Item label="Event" value="event" />
            <Picker.Item label="Out of Office" value="outOfOffice" />
            <Picker.Item label="Task" value="task" />
          </Picker>
        </View>

        <View style={Styles.buttonView}>
          <TouchableOpacity
            onPress={() =>
              route.params.id ? EditEventCall() : CreateEventCall()
            }
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 14, fontWeight: 'bold', color: Colors.white }}
            >
              {route.params.id ? 'Edit Event' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateEvent;
