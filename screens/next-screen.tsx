import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { Button } from '../components/Button';

type RootStackParamList = {
	Home: undefined;
	Next: undefined;
};

type NextScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Next'>;

export default function NextScreen({
	navigation,
}: {
	navigation: NextScreenNavigationProp;
}) {
	return (
		<SafeAreaView className='flex-1'>
			<LinearGradient
				colors={['#00B4DB', '#0083B0', '#0063B2']}
				className='flex-1 items-center justify-center space-y-8'>
				<Text className='text-5xl font-[DMSans]'>Trivia</Text>
				<Text className='text-base font-[DMSans]'>
					Answer as many questions as you can in a row!
				</Text>
				<Button label='START' onPress={() => navigation.navigate('Home')} />
			</LinearGradient>
		</SafeAreaView>
	);
}
