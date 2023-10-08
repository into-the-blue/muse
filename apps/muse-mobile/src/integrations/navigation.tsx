import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../pages/Home';
import { SelectNotes } from '../pages/SelectNotes';
import { Review } from '../pages/Review';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}} initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={Home} />
        <Stack.Screen name={'SelectNotes'} component={SelectNotes} />
        <Stack.Screen name={'Review'} component={Review} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
