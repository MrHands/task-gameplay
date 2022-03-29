import React from 'react';
import { Shift } from '../enums/Shift';

import './ShiftHud.scss';

export default class ShiftHud extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-shiftHud'];
		classes.push(className);

		return classes;
	}

	render() {
		const {
			day,
			shift,
			charactersNotDone,
			handleFinishShift 
		} = this.props;

		const shiftName = Object.keys(Shift).find(key => Shift[key] === shift);

		let hint = null;
		if (charactersNotDone.length > 0) {
			hint = 'All characters must perform a task to finish the shift';
		}

		let finishButton = null;
		if (handleFinishShift) {
			finishButton = (
				<button className="m-shiftHud__finish" onClick={handleFinishShift} disabled={charactersNotDone.length > 0}>
					Finish Shift
				</button>
			);
		}

		return (
			<div className={this.classes.join(' ')}>
				<h2 className="m-shiftHud__title">{`Day ${day} - ${shiftName}`}</h2>
				{finishButton}
				<h3 className="m-shiftHud__hint">{hint}</h3>
			</div>
		);
	}
}