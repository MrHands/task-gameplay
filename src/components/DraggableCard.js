import { useDrag } from 'react-dnd';

export default function DraggableCard(props) {
	console.log(props);
	const [ collected, drag, dragPreview ] = useDrag(() => ({
		type: 'card',
		item: props.card,
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		}),
	}));
	return collected.isDragging ? (
		<div ref={dragPreview} {...props} style={{ opacity: 0.1 }}/>
	) : (
		<div ref={drag} {...collected} {...props}>
			{props.children}
		</div>
	);
}