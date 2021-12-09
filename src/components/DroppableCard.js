import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	console.log(props);
	const [ collected, drop ] = useDrop(() => ({
		accept: 'card',
		collect: monitor => ({
			isover: (!!monitor.isOver()).toString()
		}),
		drop: card => props.onTaskDropped(card),
	}), [props.card]);

	return (
		<div ref={drop} {...collected} {...props}>
			{props.children}
		</div>
	);
}