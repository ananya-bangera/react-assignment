import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyShiftsScreen from './MyShiftsScreen';
import AllShiftsScreen from './AllShiftsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';

export default function App() {

  const Tab = createBottomTabNavigator();
  const [shifts, setShifts] = useState();
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'My Shifts') {
            iconName = focused
              ? 'person'
              : 'person-outline';
          } else if (route.name === 'Available Shifts') {
            iconName = focused
              ? 'calendar'
              : 'calendar-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#004FB4',
        tabBarInactiveTintColor: '#A4B8D3',
      })}>
        <Tab.Screen name="My Shifts"   children={()=><MyShiftsScreen shifts={shifts} setShifts={setShifts}/>} />
        <Tab.Screen name="Available Shifts" children={()=><AllShiftsScreen shifts={shifts} setShifts={setShifts}/>}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});
