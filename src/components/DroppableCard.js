import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	console.log(props);
	const [ collected, drop ] = useDrop(() => ({
		accept: 'card',
		collect: monitor => ({
			isover: (!!monitor.isOver()).toString()
		}),
		drop: card => props.onTaskDropped(props.owner, card),
	}), [props.owner]);

	return (
		<div ref={drop} {...collected} {...props}>
			{props.children}
		</div>
	);
}