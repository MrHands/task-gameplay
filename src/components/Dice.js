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

		if (isSpent) {
			classes.push('-spent');
		}

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

	if (isSpent) {
		return <div className={classes.join(' ')}/>;
	} else if (isDragging) {
		return <div ref={dragPreview} className={classes.join(' ')} style={{ opacity: 0.1 }}/>;
	}

	return (
		<div ref={drag} className={classes.join(' ')}>
			<svg className="a-dice__graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
				<use href={`#dice-${value}`}></use>
			</svg>
		</div>
	);
}