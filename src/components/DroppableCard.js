import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	let {
		className,
		children,
		owner,
		onCharacterDropped,
		canBePlaced,
	} = props;

	const [ { isOver, canDrop, id }, drop ] = useDrop(() => ({
		accept: 'character',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			id: monitor.getItem(),
		}),
		drop: id => onCharacterDropped(id),
	}), []);

	if (isOver && canDrop) {
		if (canBePlaced(id)) {
			className += ' -active';
		} else {
			className += ' -denied';
		}
	}

	return (
		<div ref={drop} className={className}>
			{children}
		</div>
	);
}