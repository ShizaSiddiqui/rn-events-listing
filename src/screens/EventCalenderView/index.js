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
  FlatList,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Colors from '../../assests/colors';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import Styles from './styles';

const EventCalenderView = ({ navigation }) => {
  const [eventList, setEventList] = useState([]);
  const [initialList, setInitialList] = useState([]);

  useEffect(() => {
    eventsData();
  }, []);

  const DeleteEvent = async (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete the event?', [
      {
        text: 'Cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          var arr = initialList;

          for (var i = 0; i < initialList.length; i++) {
            if (initialList[i].id == id) {
              arr[i] = arr[arr.length - 1];
              arr.pop();
              break;
            }
          }

          setInitialList(arr);

          const localStorage = JSON.stringify(arr);
          AsyncStorage.setItem('event_listing', localStorage);

          getEventListing('all', arr);
        },
      },
    ]);
  };

  const EditEvent = async (id) => {
    Alert.alert('Edit', 'Are you sure you want to make changes?', [
      {
        text: 'Cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('CreateEvent', {
            name: 'Edit Event',
            id: id,
          });
        },
      },
    ]);
  };

  const eventsData = async () => {
    const localStorage = await AsyncStorage.getItem('event_listing');

    if (localStorage != null) {
      setInitialList(JSON.parse(localStorage));
    } else {
      setInitialList([]);
    }
  };

  const getEventListing = async (date, events) => {
    setEventList([]);
    var arr = [];

    for (var i = 0; i < events.length; i++) {
      if (
        moment(events[i].dateAndTime).format('DD-MM-YYYY') ==
        moment(date).format('DD-MM-YYYY')
      ) {
        arr.push(events[i]);
      }
    }

    setEventList(arr);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', height: 55, marginBottom: hp(2) }}>
        <View
          style={{
            flex: 1,
            borderRadius: 5,
            marginHorizontal: wp(1),
            marginTop: hp(1),
            justifyContent: 'center',
          }}
        ></View>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.olive,
            borderRadius: 5,
            marginHorizontal: wp(1),
            marginTop: hp(1),
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateEvent', {
                name: 'CreateEvent',
              })
            }
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 15, fontWeight: 'bold', color: Colors.white }}
            >
              + Create Event
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CalendarPicker
        onDateChange={(date) => getEventListing(date, initialList)}
        selectedDayColor={Colors.olive}
        selectedDayTextColor={Colors.white}
        todayTextStyle={{ color: Colors.white, fontWeight: 'bold' }}
        todayBackgroundColor={Colors.gray}
        textStyle={{ color: Colors.olive, fontWeight: 'bold' }}
      />
      <View
        style={{
          borderColor: Colors.olive,
          borderWidth: 1,
          alignSelf: 'center',
          width: '100%',
          marginVertical: hp(2),
        }}
      />
      {eventList.length == 0 ? (
        <Text
          style={{
            color: Colors.olive,
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
            marginTop: hp(6),
          }}
        >
          No events found
        </Text>
      ) : (
        <FlatList
          // data={eventList}
          data={eventList.sort((a, b) => a.title.localeCompare(b.title))}
          renderItem={({ item, index }) => {
            return (
              <View style={Styles.flatListView}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 2, justifyContent: 'center' }}>
                    <Text style={{ color: Colors.olive }}>
                      <Text style={{ fontWeight: 'bold' }}>Event Title:</Text>{' '}
                      {item.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => DeleteEvent(item.id)}
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35,
                        borderColor: Colors.olive,
                        borderWidth: 1,
                        marginRight: wp(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={require('../../assests/images/delete.png')}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: Colors.olive,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => EditEvent(item.id)}
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35,
                        borderColor: Colors.olive,
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={require('../../assests/images/edit.png')}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: Colors.olive,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 10, marginBottom: 15 }}>
                  <Text style={{ color: Colors.olive }}>
                    <Text style={{ fontWeight: 'bold' }}>Date and Time:</Text>{' '}
                    {moment(item.dateAndTime).format('YYYY-MM-DD hh:mm a')}
                  </Text>
                </View>

                {item.description ? (
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: Colors.olive }}>
                      <Text style={{ fontWeight: 'bold' }}>Description:</Text>{' '}
                      {item.description}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default EventCalenderView;
