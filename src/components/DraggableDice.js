import { useDrag } from 'react-dnd';

export default function DraggableDice(props) {
	const {
		id,
		className,
		children
	} = props;

	const [ { isDragging }, drag, dragPreview ] = useDrag(() => ({
		type: 'dice',
		item: { id },
		collect: monitor => ({
			isDragging: monitor.isDragging()
		}),
	}), [id]);

	return isDragging ? (
		<div ref={dragPreview} className={className} style={{ opacity: 0.1 }}/>
	) : (
		<div ref={drag} className={className}>
			{children}
		</div>
	);
}