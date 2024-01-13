import { NavigationContainer } from '@react-navigation/native';
import {
	TransitionPresets,
	createStackNavigator,
} from '@react-navigation/stack';
import { loadAsync } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import HomeScreen from './screens/home-screen';
import NextScreen from './screens/next-screen';

export default function App() {
	const Stack = createStackNavigator();

	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		preventAutoHideAsync();
		loadFonts();
	}, []);

	const loadFonts = async () => {
		await loadAsync({
			DMSans: require('./assets/fonts/DMSans-Regular.ttf'),
		});
		setFontsLoaded(true);
		hideAsync();
	};

	if (!fontsLoaded) {
		return null;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					gestureEnabled: true,
					cardOverlayEnabled: true,
					...TransitionPresets.ModalSlideFromBottomIOS,
				}}>
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='Next' component={NextScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
