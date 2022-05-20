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
			{value}
		</div>
	);
}