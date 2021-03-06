import { useDrag } from 'react-dnd';

export default function DraggableCard(props) {
	const {
		id,
		className,
		children
	} = props;

	const [ { isDragging }, drag, dragPreview ] = useDrag(() => ({
		type: 'character',
		item: { id },
		collect: monitor => ({
			isDragging: monitor.isDragging()
		}),
	}), [id]);

	if (isDragging) {
		console.log(`dragging ${id}`);
	}

	return isDragging ? (
		<div ref={dragPreview} className={className} style={{ opacity: 0.1 }}/>
	) : (
		<div ref={drag} className={className}>
			{children}
		</div>
	);
}