import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	const [ collected, drop ] = useDrop(() => ({
		accept: 'card',
		collect: monitor => ({
			isover: (!!monitor.isOver()).toString()
		}),
		drop: () => {
		},
	}), [props.card]);

	return (
		<div ref={drop} {...collected} {...props}>
			{props.children}
		</div>
	);
}