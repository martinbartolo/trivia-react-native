import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios, { AxiosResponse } from 'axios';
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
	const [token, setToken] = useState<string>();
	const [question, setQuestion] = useState<string>();
	const [category, setCategory] = useState<string>();
	const [probabilities, setProbabilities] = useState<{
		easy: number;
		medium: number;
		hard: number;
	}>({
		easy: 100,
		medium: 0,
		hard: 0,
	});
	const [correctAnswer, setCorrectAnswer] = useState<string>();
	const [answers, setAnswers] = useState<string[]>([]);
	const [selectedAnswer, setSelectedAnswer] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [retryCount, setRetryCount] = useState<number>(0);

	// Fetch new question on screen focus
	useFocusEffect(
		useCallback(() => {
			fetchQuestion();
			// Cleanup
			return () => {
				setScore(0);
				setQuestion('');
				setCategory('');
				setProbabilities({
					easy: 100,
					medium: 0,
					hard: 0,
				});
				setCorrectAnswer('');
				setAnswers([]);
				setSelectedAnswer(undefined);
				setIsLoading(false);
			};
		}, [])
	);

	const fetchQuestion = async () => {
		setIsLoading(true);

		// If token doesn't exist, fetch token first
		// This prevents getting duplicate questions
		// Only happens on first question
		let currentToken = token;
		if (!currentToken) {
			currentToken = await fetchToken();
		}

		const difficulty = getDifficulty();
		axios
			.get(
				`https://opentdb.com/api.php?amount=1&token=${currentToken}&type=multiple&difficulty=${difficulty}`
			)
			.then((response) => handleFetchResponse(response))
			.catch((error) => {
				if (error.response && error.response.status === 429 && retryCount < 3) {
					// Too many requests, retry after 1 second
					// Only retry 3 times
					handleFetchRetry();
				} else {
					console.error(error);
					setIsLoading(false);
				}
			});
	};

	const fetchToken = async () => {
		try {
			const response = await axios.get(
				'https://opentdb.com/api_token.php?command=request'
			);
			setToken(response.data.token);
			return response.data.token;
		} catch (error) {
			console.error(error);
		}
	};

	// Determine question difficulty based on probabilities
	const getDifficulty = () => {
		const random = Math.random() * 100;
		let difficulty;
		if (random < probabilities.easy) {
			difficulty = 'easy';
		} else if (random < probabilities.easy + probabilities.medium) {
			difficulty = 'medium';
		} else {
			difficulty = 'hard';
		}
		return difficulty;
	};

	// Set states from api response
	const handleFetchResponse = (response: AxiosResponse) => {
		const data = response.data.results[0];
		setQuestion(he.decode(data.question));

		// If there is a subcategory, use that instead of the category
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
		setRetryCount(0); // Reset retry count
	};

	const handleFetchRetry = () => {
		setRetryCount(retryCount + 1);
		setTimeout(() => {
			fetchQuestion();
		}, 1000);
	};

	const handleAnswer = (answer: string) => {
		setSelectedAnswer(answer);
		if (answer === correctAnswer) {
			setScore(score + 1);

			// Make the chance of getting a hard question progressively higher
			// When easy probability reaches 0 medium will be 70% and hard will be 30%
			if (probabilities.easy > 0) {
				setProbabilities({
					easy: probabilities.easy - 5,
					medium: probabilities.medium + 3.5,
					hard: probabilities.hard + 1.5,
				});
			}

			// Fetch new question after 1 second
			setTimeout(() => {
				fetchQuestion();
				setSelectedAnswer(undefined);
			}, 1000);
		} else {
			// Go to GameOver screen after 1 second
			setTimeout(() => {
				navigation.navigate('GameOver', { score: score });
			}, 1000);
		}
	};

	return (
		<SafeAreaView className='flex-1'>
			<Background>
				<View className='flex-1 items-center justify-between py-20'>
					<Text className='text-3xl font-bold'>Score: {score}</Text>
					{isLoading ? (
						// Loading Spinner
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
