import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Lobby } from '../pages/Lobby';
import { SelectNotes } from '../pages/SelectNotes';
import { Review } from '../pages/Review';
import type { NavigationRouterList } from '@muse/types';

const Stack = createNativeStackNavigator<NavigationRouterList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}} initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={Lobby} />
        <Stack.Screen name={'SelectNotes'} component={SelectNotes} />
        <Stack.Screen name={'Review'} component={Review} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
