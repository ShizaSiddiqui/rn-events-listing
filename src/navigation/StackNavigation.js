import CreateEvent from '../screens/CreateEvent/index';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTabNavigation';
import * as Colors from '../assests/colors';

const Stack = createStackNavigator();

function EventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={({ navigation, route }) => ({
          headerTitle: route.params.name,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: Colors.olive },
          headerTitleStyle: { color: Colors.white },
          headerTintColor: Colors.white,
        })}
      />
    </Stack.Navigator>
  );
}

export default EventStack;
