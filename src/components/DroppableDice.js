import { useDrop } from 'react-dnd';

export default function DroppableDice(props) {
	let {
		className,
		children,
		task,
		canDiceBeDropped,
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

	let dropValue = 0;

	if (isOver && canDrop) {
		if (canDiceBeDropped(dice.id, task)) {
			dropValue = dice.value;
			className += ' -active';
		} else {
			className += ' -denied';
		}
	}

	return (
		<div ref={drop} className={className} data-drop-value={dropValue}>
			{children}
		</div>
	);
}