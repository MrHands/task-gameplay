import React from 'react';

import './ShiftHud.css';

export default class ShiftHud extends React.Component {
	render() {
		const {
			characters,
			shift,
			handleFinishShift 
		} = this.props;

		const ShiftText = [ 'morning', 'afternoon', 'evening', 'night' ];

		const charactersNotDone = characters.filter(character => !character.task || character.task.outcome === '');

		let hint = null;
		if (charactersNotDone.length > 0) {
			hint = <h3>All characters must perform a task to finish the shift</h3>
		}

		return (
			<div className={['m-shiftHud', this.props.className].join(' ')}>
				<h2 className="m-shiftHud__title">{ShiftText[shift]}</h2>
				<button onClick={handleFinishShift} disabled={charactersNotDone.length > 0}>
					Finish Shift
				</button>
				{hint}
			</div>
		);
	}
}