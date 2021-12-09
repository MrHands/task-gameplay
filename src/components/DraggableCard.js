import { useDrag } from 'react-dnd';

export default function DraggableCard(props) {
	const [ collected, drag, dragPreview ] = useDrag(() => ({
		type: 'card',
		item: props.card,
		collect: monitor => ({
			isdragging: (!!monitor.isDragging()).toString()
		}),
	}));
	return collected.isdragging === 'true' ? (
		<div ref={dragPreview} {...props} style={{ opacity: 0.1 }}/>
	) : (
		<div ref={drag} {...collected} {...props}>
			{props.children}
		</div>
	);
}