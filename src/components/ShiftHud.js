import React from 'react';
import { Shift } from '../enums/Shift';

import './ShiftHud.scss';

export default function ShiftHud(props) {
	const {
		sexergy,
		day,
		shift,
		dice,
		handleFinishShift 
	} = props;

	const classes = (() => {
		const {
			className,
		} = props;

		const classes = ['m-shiftHud'];
		classes.push(className);

		return classes;
	})();

	const shiftName = Object.keys(Shift).find(key => Shift[key] === shift);

	/* let hint = null;
	if (dice.length > 0) {
		hint = 'Spend all your Action Dice to finish the shift.';
	} */

	return (
		<div className={classes.join(' ')}>
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
				<button className="m-shiftHud__finish" onClick={handleFinishShift}>
					Finish Shift
				</button>
			</div>
		</div>
	);
}