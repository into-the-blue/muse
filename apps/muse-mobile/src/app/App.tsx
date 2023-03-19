import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../pages/home';
// import { useDeviceContext } from 'src/configs/tailwind';

const Stack = createNativeStackNavigator();

const App = () => {
  // useDeviceContext();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}} initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
