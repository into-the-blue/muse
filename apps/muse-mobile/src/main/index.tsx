import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../pages/home';
import { RealmWrapper } from '../integrations/realm';
// import { useDeviceContext } from 'src/configs/tailwind';

const Stack = createNativeStackNavigator();

const App = () => {
  // useDeviceContext();
  return (
    <RealmWrapper>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{}} initialRouteName={'Home'}>
          <Stack.Screen name={'Home'} component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmWrapper>
  );
};
export default App;
