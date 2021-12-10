import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	let {
		className,
		owner,
		canBePlayed
	} = props;

	const [ { isOver, canDrop, item }, drop ] = useDrop(() => ({
		accept: 'card',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			item: monitor.getItem(),
		}),
		drop: card => props.onTaskDropped(props.owner, card),
	}), [props.owner]);

	if (isOver && canDrop) {
		if (canBePlayed(owner, item)) {
			className += ' -active';
		} else {
			className += ' -denied';
		}
	}

	return (
		<div ref={drop} className={className}>
			{props.children}
		</div>
	);
}