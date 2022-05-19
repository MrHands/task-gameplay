import { useDrop } from 'react-dnd';

export default function DroppableDice(props) {
	let {
		className,
		children,
		task,
		onDiceDropped,
	} = props;

	const [ { isOver, canDrop, dice }, drop ] = useDrop(() => ({
		accept: 'dice',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			dice: monitor.getItem(),
		}),
		drop: dice => onDiceDropped(dice.id, task),
	}), [task]);

	/* if (isOver && canDrop) {
		if (canBePlaced(character.id, task)) {
			className += ' -active';
		} else {
			className += ' -denied';
		}
	} */

	return (
		<div ref={drop} className={className}>
			{children}
		</div>
	);
}