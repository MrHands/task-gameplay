import React from 'react';
import { useDrag } from 'react-dnd';

import './Dice.scss';

export default function Dice(props) {
	const {
		id,
		value,
		isSpent,
	} = props;

	console.log(`id ${id} value ${value} isSpent ${isSpent}`);

	const classes = (() => {
		const classes = [
			'a-dice',
			props.className,
		];

		return classes;
	})();

	const [ { isDragging }, drag, dragPreview ] = useDrag(() => ({
		type: 'dice',
		item: { id },
		canDrag: () => !isSpent,
		collect: monitor => ({
			isDragging: monitor.isDragging()
		}),
	}), [id]);

	return (!isSpent && isDragging) ? (
		<div ref={dragPreview} className={classes.join(' ')} style={{ opacity: 0.1 }}/>
	) : (
		<div ref={drag} className={classes.join(' ')}>
			<svg className="a-dice__graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
				<defs>
					<symbol id="dice-1" viewBox="-32 -32 64 64">
						<path stroke="none" fill="#FFFFFF" d="M-16.2 -32 L16.25 -32 Q32 -32 32 -16.2 L32 16.25 Q32 32 16.25 32 L-16.2 32 Q-32 32 -32 16.25 L-32 -16.2 Q-32 -32 -16.2 -32 M6 0 Q6 -2.5 4.25 -4.25 2.55 -6 0 -6 -2.5 -6 -4.25 -4.25 -6 -2.5 -6 0 -6 2.5 -4.25 4.25 -2.5 6 0 6 2.55 6 4.25 4.25 6 2.5 6 0"/>
					</symbol>
					<symbol id="dice-2" viewBox="-32 -32 64 64">
						<path stroke="none" fill="#FFFFFF" d="M21 -15 Q21 -17.5 19.25 -19.25 17.55 -21 15 -21 12.5 -21 10.75 -19.25 9 -17.5 9 -15 9 -12.5 10.75 -10.75 12.5 -9 15 -9 17.55 -9 19.25 -10.75 21 -12.5 21 -15 M-16.2 -32 L16.25 -32 Q32 -32 32 -16.2 L32 16.25 Q32 32 16.25 32 L-16.2 32 Q-32 32 -32 16.25 L-32 -16.2 Q-32 -32 -16.2 -32 M-9 15 Q-9 12.5 -10.75 10.75 -12.45 9 -15 9 -17.5 9 -19.25 10.75 -21 12.5 -21 15 -21 17.5 -19.25 19.25 -17.5 21 -15 21 -12.45 21 -10.75 19.25 -9 17.5 -9 15"/>
					</symbol>
					<symbol id="dice-3" viewBox="-32 -32 64 64">
						<path stroke="none" fill="#FFFFFF" d="M6 0 Q6 -2.5 4.25 -4.25 2.55 -6 0 -6 -2.5 -6 -4.25 -4.25 -6 -2.5 -6 0 -6 2.5 -4.25 4.25 -2.5 6 0 6 2.55 6 4.25 4.25 6 2.5 6 0 M21 -15 Q21 -17.5 19.25 -19.25 17.55 -21 15 -21 12.5 -21 10.75 -19.25 9 -17.5 9 -15 9 -12.5 10.75 -10.75 12.5 -9 15 -9 17.55 -9 19.25 -10.75 21 -12.5 21 -15 M-16.2 -32 L16.25 -32 Q32 -32 32 -16.2 L32 16.25 Q32 32 16.25 32 L-16.2 32 Q-32 32 -32 16.25 L-32 -16.2 Q-32 -32 -16.2 -32 M-9 15 Q-9 12.5 -10.75 10.75 -12.45 9 -15 9 -17.5 9 -19.25 10.75 -21 12.5 -21 15 -21 17.5 -19.25 19.25 -17.5 21 -15 21 -12.45 21 -10.75 19.25 -9 17.5 -9 15"/>
					</symbol>
					<symbol id="dice-4" viewBox="-32 -32 64 64">
						<path stroke="none" fill="#FFFFFF" d="M21 -15 Q21 -17.5 19.25 -19.25 17.55 -21 15 -21 12.5 -21 10.75 -19.25 9 -17.5 9 -15 9 -12.5 10.75 -10.75 12.5 -9 15 -9 17.55 -9 19.25 -10.75 21 -12.5 21 -15 M-16.2 -32 L16.25 -32 Q32 -32 32 -16.2 L32 16.25 Q32 32 16.25 32 L-16.2 32 Q-32 32 -32 16.25 L-32 -16.2 Q-32 -32 -16.2 -32 M-9 15 Q-9 12.5 -10.75 10.75 -12.45 9 -15 9 -17.5 9 -19.25 10.75 -21 12.5 -21 15 -21 17.5 -19.25 19.25 -17.5 21 -15 21 -12.45 21 -10.75 19.25 -9 17.5 -9 15 M-9 -15 Q-9 -17.5 -10.75 -19.25 -12.45 -21 -15 -21 -17.5 -21 -19.25 -19.25 -21 -17.5 -21 -15 -21 -12.5 -19.25 -10.75 -17.5 -9 -15 -9 -12.45 -9 -10.75 -10.75 -9 -12.5 -9 -15 M21 15 Q21 12.5 19.25 10.75 17.55 9 15 9 12.5 9 10.75 10.75 9 12.5 9 15 9 17.5 10.75 19.25 12.5 21 15 21 17.55 21 19.25 19.25 21 17.5 21 15"/>
					</symbol>
					<symbol id="dice-5" viewBox="-32 -32 64 64">
						<path stroke="none" fill="#FFFFFF" d="M6 0 Q6 -2.5 4.25 -4.25 2.55 -6 0 -6 -2.5 -6 -4.25 -4.25 -6 -2.5 -6 0 -6 2.5 -4.25 4.25 -2.5 6 0 6 2.55 6 4.25 4.25 6 2.5 6 0 M21 -15 Q21 -17.5 19.25 -19.25 17.55 -21 15 -21 12.5 -21 10.75 -19.25 9 -17.5 9 -15 9 -12.5 10.75 -10.75 12.5 -9 15 -9 17.55 -9 19.25 -10.75 21 -12.5 21 -15 M-16.2 -32 L16.25 -32 Q32 -32 32 -16.2 L32 16.25 Q32 32 16.25 32 L-16.2 32 Q-32 32 -32 16.25 L-32 -16.2 Q-32 -32 -16.2 -32 M-9 15 Q-9 12.5 -10.75 10.75 -12.45 9 -15 9 -17.5 9 -19.25 10.75 -21 12.5 -21 15 -21 17.5 -19.25 19.25 -17.5 21 -15 21 -12.45 21 -10.75 19.25 -9 17.5 -9 15 M-9 -15 Q-9 -17.5 -10.75 -19.25 -12.45 -21 -15 -21 -17.5 -21 -19.25 -19.25 -21 -17.5 -21 -15 -21 -12.5 -19.25 -10.75 -17.5 -9 -15 -9 -12.45 -9 -10.75 -10.75 -9 -12.5 -9 -15 M21 15 Q21 12.5 19.25 10.75 17.55 9 15 9 12.5 9 10.75 10.75 9 12.5 9 15 9 17.5 10.75 19.25 12.5 21 15 21 17.55 21 19.25 19.25 21 17.5 21 15"/>
					</symbol>
					<symbol id="dice-6" viewBox="-32 -32 64 64">
						<path stroke="none" fill="#FFFFFF" d="M21 -15 Q21 -17.5 19.25 -19.25 17.55 -21 15 -21 12.5 -21 10.75 -19.25 9 -17.5 9 -15 9 -12.5 10.75 -10.75 12.5 -9 15 -9 17.55 -9 19.25 -10.75 21 -12.5 21 -15 M21 0 Q21 -2.5 19.25 -4.25 17.55 -6 15 -6 12.5 -6 10.75 -4.25 9 -2.5 9 0 9 2.5 10.75 4.25 12.5 6 15 6 17.55 6 19.25 4.25 21 2.5 21 0 M-16.2 -32 L16.25 -32 Q32 -32 32 -16.2 L32 16.25 Q32 32 16.25 32 L-16.2 32 Q-32 32 -32 16.25 L-32 -16.2 Q-32 -32 -16.2 -32 M-9 15 Q-9 12.5 -10.75 10.75 -12.45 9 -15 9 -17.5 9 -19.25 10.75 -21 12.5 -21 15 -21 17.5 -19.25 19.25 -17.5 21 -15 21 -12.45 21 -10.75 19.25 -9 17.5 -9 15 M-9 0 Q-9 -2.5 -10.75 -4.25 -12.45 -6 -15 -6 -17.5 -6 -19.25 -4.25 -21 -2.5 -21 0 -21 2.5 -19.25 4.25 -17.5 6 -15 6 -12.45 6 -10.75 4.25 -9 2.5 -9 0 M-9 -15 Q-9 -17.5 -10.75 -19.25 -12.45 -21 -15 -21 -17.5 -21 -19.25 -19.25 -21 -17.5 -21 -15 -21 -12.5 -19.25 -10.75 -17.5 -9 -15 -9 -12.45 -9 -10.75 -10.75 -9 -12.5 -9 -15 M21 15 Q21 12.5 19.25 10.75 17.55 9 15 9 12.5 9 10.75 10.75 9 12.5 9 15 9 17.5 10.75 19.25 12.5 21 15 21 17.55 21 19.25 19.25 21 17.5 21 15"/>
					</symbol>
				</defs>
				<use href={`#dice-${value}`}></use>
			</svg>
		</div>
	);
}