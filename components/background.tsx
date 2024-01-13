import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

export default function Background({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<LinearGradient
			start={{ x: 1, y: 0 }}
			end={{ x: 0, y: 1 }}
			colors={['#63D1F4', '#0A609B']}
			className='flex-1'>
			{children}
		</LinearGradient>
	);
}
