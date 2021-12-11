import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	let {
		className,
		children,
		owner,
		onTaskDropped,
		canBePlayed,
	} = props;

	const [ { isOver, canDrop, card }, drop ] = useDrop(() => ({
		accept: 'card',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			card: monitor.getItem(),
		}),
		drop: card => onTaskDropped(owner, card),
	}), [owner]);

	if (isOver && canDrop) {
		if (canBePlayed(owner, card)) {
			className += ' -active';
		} else {
			className += ' -denied';
		}
	}

	return (
		<div ref={drop} className={className}>
			{children}
		</div>
	);
}