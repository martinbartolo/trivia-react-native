import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import he from 'he';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import Background from '../components/background';

type PlayScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

export default function PlayScreen({
	navigation,
}: {
	navigation: PlayScreenNavigationProp;
}) {
	const [score, setScore] = useState<number>(0);
	const [question, setQuestion] = useState<string>('');
	const [category, setCategory] = useState<string>('');
	const [correctAnswer, setCorrectAnswer] = useState<string>('');
	const [answers, setAnswers] = useState<string[]>([]);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	let retryCount = 0;

	const fetchQuestion = () => {
		setIsLoading(true);
		axios
			.get('https://opentdb.com/api.php?amount=1&type=multiple')
			.then((response) => {
				const data = response.data.results[0];

				setQuestion(he.decode(data.question));

				const categoryParts = he.decode(data.category).split(': ');
				setCategory(categoryParts[1] || categoryParts[0]);

				setCorrectAnswer(he.decode(data.correct_answer));
				const allAnswers = [
					he.decode(data.correct_answer),
					...data.incorrect_answers.map(he.decode),
				];
				const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
				setAnswers(shuffledAnswers);
				setIsLoading(false);
				retryCount = 0;
			})
			.catch((error) => {
				if (error.response && error.response.status === 429) {
					// Increase retry count and calculate wait time
					retryCount++;
					const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
					setTimeout(fetchQuestion, waitTime);
				} else {
					console.error(error);
					setIsLoading(false);
				}
			});
	};

	// Fetch question on mount
	useFocusEffect(
		useCallback(() => {
			fetchQuestion();

			// Cleanup
			return () => {
				setScore(0);
				setQuestion('');
				setCategory('');
				setCorrectAnswer('');
				setAnswers([]);
				setSelectedAnswer(null);
			};
		}, [])
	);

	const handleAnswer = (answer: string) => {
		setSelectedAnswer(answer);
		if (answer === correctAnswer) {
			setScore(score + 1);
			// Fetch new question after 3 seconds
			setTimeout(() => {
				fetchQuestion();
				setSelectedAnswer(null);
			}, 2000);
		} else {
			setTimeout(() => {
				// Navigate to GameOver screen with the current score after 2 seconds
				navigation.navigate('GameOver', { score: score });
			}, 2000);
		}
	};

	return (
		<SafeAreaView className='flex-1'>
			<Background>
				<View className='flex-1 items-center justify-between py-20'>
					<Text className='text-3xl font-bold'>Score: {score}</Text>
					{isLoading ? (
						<View className='flex-1 items-center justify-center'>
							<ActivityIndicator
								size='large'
								color='black'
								className='scale-150'
							/>
						</View>
					) : (
						<View className='flex-1 items-center justify-center space-y-8 px-4 w-full'>
							<Text className='text-lg font-bold'>
								{category && `Category: ${category}`}
							</Text>
							<Text className='text-lg'>{question}</Text>
							{answers.map((answer, index) => {
								const isCorrect = answer === correctAnswer;
								const isSelected = answer === selectedAnswer;
								const correctStyle = selectedAnswer
									? isCorrect
										? 'bg-green-500'
										: 'bg-red-500'
									: 'bg-black';
								const selectedStyle = isSelected
									? 'text-white border-2 border-black'
									: 'text-white';
								return (
									<Button
										key={index}
										label={answer}
										onPress={() => handleAnswer(answer)}
										className={`w-full ${correctStyle} ${selectedStyle}`}
									/>
								);
							})}
						</View>
					)}
				</View>
			</Background>
		</SafeAreaView>
	);
}
