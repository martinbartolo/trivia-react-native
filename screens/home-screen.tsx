import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import Background from '../components/background';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen({
	navigation,
}: {
	navigation: HomeScreenNavigationProp;
}) {
	return (
		<SafeAreaView className='flex-1'>
			<Background>
				<View className='flex-1 items-center justify-center space-y-8 px-2'>
					<Text className='text-5xl font-medium'>Trivia</Text>
					<Text className='text-lg'>
						Answer as many questions as you can in a row!
					</Text>
					<Button
						label='START'
						onPress={() => navigation.navigate('Play')}
						className='w-48'
					/>
				</View>
			</Background>
		</SafeAreaView>
	);
}
