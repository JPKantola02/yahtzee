import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/components/HomeScreen';
import GameboardScreen from './src/components/GameboardScreen';
import ScoreBoardScreen from './src/components/ScoreboardScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Gameboard" component={GameboardScreen} />
        <Tab.Screen name="Scoreboard" component={ScoreBoardScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;