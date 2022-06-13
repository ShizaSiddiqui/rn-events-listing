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
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Colors from '../../assests/colors';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import Styles from './styles';

const EventListView = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState();

  const [originalEventList, setOriginalEventList] = useState([]);

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    getEventData();
  }, []);

  const DeleteEvent = async (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete the event?', [
      {
        text: 'Cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          var arr = originalEventList;

          for (var i = 0; i < originalEventList.length; i++) {
            if (originalEventList[i].id == id) {
              arr[i] = arr[arr.length - 1];
              arr.pop();
              break;
            }
          }

          setOriginalEventList(arr);

          const localStorage = JSON.stringify(arr);
          AsyncStorage.setItem('event_listing', localStorage);

          EventListLoad('all', arr);
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

  const getEventData = async () => {
    const localStorage = await AsyncStorage.getItem('event_listing');

    if (localStorage != null) {
      setOriginalEventList(JSON.parse(localStorage));

      EventListLoad('all', JSON.parse(localStorage));
    } else {
      setOriginalEventList([]);
    }
  };

  const EventListLoad = async (type, events) => {
    setEventList([]);
    var arr = [];

    if (type != 'all') {
      for (var i = 0; i < events.length; i++) {
        if (events[i].type == type) {
          arr.push(events[i]);
        }
      }
    } else {
      for (var i = 0; i < events.length; i++) {
        arr.push(events[i]);
      }
    }

    setEventList(arr);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', height: 55 }}>
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
          <Picker
            style={{ color: Colors.white }}
            dropdownIconColor={Colors.white}
            selectedValue={selectedType}
            onValueChange={(itemValue) => {
              setSelectedType(itemValue);

              EventListLoad(itemValue, originalEventList);
            }}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Event" value="event" />
            <Picker.Item label="Out of Office" value="outOfOffice" />
            <Picker.Item label="Task" value="task" />
          </Picker>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.olive,
            borderRadius: 5,
            marginHorizontal: 10,
            marginTop: 10,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateEvent', {
                name: 'Create Event',
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
          style={{ marginTop: hp(3) }}
          // data={eventList}
          data={eventList.sort((a, b) => a.title.localeCompare(b.title))}
          renderItem={({ item, index }) => {
            return (
              <View style={Styles.flatListView}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 2, justifyContent: 'center' }}>
                    <Text style={{ color: Colors.olive }}>
                      <Text style={{ fontWeight: 'bold' }}>Name:</Text>{' '}
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
                        marginRight: 10,
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

export default EventListView;
