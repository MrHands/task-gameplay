import { useDrop } from 'react-dnd';

export default function DroppableCard(props) {
	let {
		className,
		children,
		task,
		onCharacterDropped,
		canBePlaced,
	} = props;

	const [ { isOver, canDrop, character }, drop ] = useDrop(() => ({
		accept: 'character',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			character: monitor.getItem(),
		}),
		drop: character => onCharacterDropped(character.id, task),
	}), [task]);

	if (isOver && canDrop) {
		if (canBePlaced(character.id, task)) {
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