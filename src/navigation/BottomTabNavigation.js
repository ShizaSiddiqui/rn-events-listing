import EventCalenderView from '../screens/EventCalenderView/index';
import EventListView from '../screens/EventListView/index';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Colors from '../assests/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.olive },
        headerTitleStyle: { color: Colors.white },
        tabBarStyle: { backgroundColor: Colors.olive },
        tabBarLabelStyle: { color: Colors.white, fontSize: 16 },
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="List View"
        component={EventListView}
        options={{
          headerTitle: 'My Events Listing',
          headerTitleAlign: 'center',
          tabBarIconStyle: { display: 'none' },
          tabBarItemStyle: {
            justifyContent: 'center',
            borderRightColor: Colors.white,
          },
        }}
      />
      <Tab.Screen
        name="Calender View"
        component={EventCalenderView}
        options={{
          headerTitle: 'My Events Calender',
          headerTitleAlign: 'center',
          tabBarIconStyle: { display: 'none' },
          tabBarItemStyle: {
            justifyContent: 'center',
            borderLeftColor: Colors.white,
            borderLeftWidth: hp(0.25),
          },
        }}
      />
    </Tab.Navigator>
  );
}
