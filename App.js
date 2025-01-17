import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import { Routes } from './src/Routes/Routes';
import { SafeAreaView } from 'react-native'

export default function App() {
  return (
    <NavigationContainer>
      
        <Routes />
        <StatusBar backgroundColor='#000' style='light' />

    </NavigationContainer>
  );
}
