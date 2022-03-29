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
			sexergy,
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

		return (
			<div className={this.classes.join(' ')}>
				<h2 className="m-shiftHud__sexergy">
					<div className="m-shiftHud__sexergy__title">Sexergy</div>
					<div className="m-shiftHud__sexergy__value">{sexergy}</div>
				</h2>
				<h2 className="m-shiftHud__day">
					{`Day ${day}`}
				</h2>
				<h2 className="m-shiftHud__shift">
					{`${shiftName}`}
				</h2>
				<div className="m-shiftHud__next">
					<button className="m-shiftHud__finish" onClick={handleFinishShift} disabled={charactersNotDone.length > 0}>
						Finish Shift
					</button>
					<h3 className="m-shiftHud__hint">{hint}</h3>
				</div>
			</div>
		);
	}
}