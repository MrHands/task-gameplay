import { useDrag } from 'react-dnd';

export default function DraggableCard(props) {
	const {
		card,
		className,
		children
	} = props;

	const [ { isDragging }, drag, dragPreview ] = useDrag(() => ({
		type: 'card',
		item: card,
		collect: monitor => ({
			isDragging: monitor.isDragging()
		}),
	}), [card]);

	if (isDragging) {
		console.log(card);
	}

	return isDragging ? (
		<div ref={dragPreview} className={className} card-id={card.handId} style={{ opacity: 0.1 }}/>
	) : (
		<div ref={drag} className={className} card-id={card.handId}>
			{children}
		</div>
	);
}