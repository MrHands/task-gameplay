import React from 'react';

import './ShiftHud.css';

export default class ShiftHud extends React.Component {
	render() {
		const {
			shift,
			handleStartShift
		} = this.props;

		const ShiftText = [ 'morning', 'afternoon', 'evening', 'night' ];

		return (
			<div className="m-shiftHud">
				<h2 className="m-shiftHud__title">{ShiftText[shift]}</h2>
				<button onClick={handleStartShift}>
					Start Shift
				</button>
			</div>
		);
	}
}