import React from 'react';
import { Shift } from '../enums/Shift';

import './ShiftHud.scss';

export default class ShiftHud extends React.Component {
	render() {
		const {
			day,
			shift,
			characters,
			handleFinishShift 
		} = this.props;

		const shiftName = Object.keys(Shift).find(key => Shift[key] === shift);

		const charactersNotDone = characters.filter(character => !character.task || character.task.outcome === '');
		console.log(charactersNotDone);

		let hint = null;
		if (charactersNotDone.length > 0) {
			hint = <h3>All characters must perform a task to finish the shift</h3>
		}

		return (
			<div className={['m-shiftHud', this.props.className].join(' ')}>
				<h2 className="m-shiftHud__title">{`Day ${day} - ${shiftName}`}</h2>
				<button onClick={handleFinishShift} disabled={charactersNotDone.length > 0}>
					Finish Shift
				</button>
				{hint}
			</div>
		);
	}
}