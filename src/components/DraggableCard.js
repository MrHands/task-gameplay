import { useDrag } from 'react-dnd';

export default function DraggableCard(props) {
	const {
		card
	} = props;

	const [ { isDragging }, drag, dragPreview ] = useDrag(() => ({
		type: 'card',
		item: card,
		collect: monitor => ({
			isDragging: monitor.isDragging()
		}),
	}));

	if (isDragging) {
		console.log(card);
	}

	return isDragging ? (
		<div ref={dragPreview} {...props} style={{ opacity: 0.1 }}/>
	) : (
		<div ref={drag} {...props}>
			{props.children}
		</div>
	);
}