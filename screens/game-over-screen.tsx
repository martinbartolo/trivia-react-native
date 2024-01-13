import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import Background from '../components/background';

type GameOverScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'GameOver'
>;
type GameOverScreenRouteProp = RouteProp<RootStackParamList, 'GameOver'>;

export default function GameOverScreen({
	route,
	navigation,
}: {
	route: GameOverScreenRouteProp;
	navigation: GameOverScreenNavigationProp;
}) {
	const { score } = route.params;
	return (
		<SafeAreaView className='flex-1'>
			<Background>
				<View className='flex-1 items-center justify-center space-y-4'>
					<Text className='text-3xl font-bold'>Game Over</Text>
					<Text className='text-3xl font-bold'>Your score: {score}</Text>
					<Button
						label='Play Again'
						onPress={() => navigation.navigate('Play')}
						className='w-48'
					/>
					<Button
						label='Home'
						onPress={() => navigation.navigate('Home')}
						className='w-48'
					/>
				</View>
			</Background>
		</SafeAreaView>
	);
}
