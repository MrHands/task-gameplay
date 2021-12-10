import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	const [ { isOver, canDrop }, drop ] = useDrop(() => ({
		accept: 'card',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
		drop: card => props.onTaskDropped(props.owner, card),
	}), [props.owner]);

	let className = props.className;
	if (isOver && canDrop) {
		className += ' -active';
	}

	return (
		<div ref={drop} {...props} className={className}>
			{props.children}
		</div>
	);
}