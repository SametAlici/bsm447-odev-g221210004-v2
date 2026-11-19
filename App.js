import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListScreen from './screens/ListScreen';
import SavedScreen from './screens/SavedScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Sekmeler() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Liste" component={ListScreen} options={{ title: 'Su Pokémonları' }} />
      <Tab.Screen name="Kaydedilenler" component={SavedScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Ana" component={Sekmeler} options={{ headerShown: false }} />
        <Stack.Screen
          name="Detay"
          component={DetailScreen}
          options={({ route }) => ({ title: route.params.pokemon.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}