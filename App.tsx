import { NavigationContainer } from '@react-navigation/native';
import {
	TransitionPresets,
	createStackNavigator,
} from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';
import GameOverScreen from './screens/game-over-screen';
import HomeScreen from './screens/home-screen';
import PlayScreen from './screens/play-screen';

preventAutoHideAsync();

export type RootStackParamList = {
	Home: undefined;
	Play: undefined;
	GameOver: { score: number }; // Define the score parameter here
};

export default function App() {
	const Stack = createStackNavigator<RootStackParamList>();

	const [fontsLoaded, fontError] = useFonts({
		DMSans: require('./assets/fonts/DMSans-Regular.ttf'),
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded || fontError) {
			await hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<View onLayout={onLayoutRootView} className='flex-1'>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
						cardOverlayEnabled: true,
						...TransitionPresets.ModalSlideFromBottomIOS,
					}}>
					<Stack.Screen name='Home' component={HomeScreen} />
					<Stack.Screen name='Play' component={PlayScreen} />
					<Stack.Screen name='GameOver' component={GameOverScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</View>
	);
}
