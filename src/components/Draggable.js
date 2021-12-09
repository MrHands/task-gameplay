import { useDrag } from 'react-dnd';

export default function DraggableCard(props) {
	console.log(props);
	const [ collected, drag, dragPreview ] = useDrag(() => ({
		type: props.card.id,
		item: props.card,
	}));
	return collected.isDragging ? (
		<div ref={dragPreview} {...props} />
	) : (
		<div ref={drag} {...collected} {...props}>
			{props.children}
		</div>
	);
}