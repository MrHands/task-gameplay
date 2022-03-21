import React from 'react';

import './ShiftHud.css';

export default class ShiftHud extends React.Component {
	render() {
		const {
			shift,
			handleFinishShift 
		} = this.props;

		const ShiftText = [ 'morning', 'afternoon', 'evening', 'night' ];

		return (
			<div className={['m-shiftHud', this.props.className].join(' ')}>
				<h2 className="m-shiftHud__title">{ShiftText[shift]}</h2>
				<button onClick={handleFinishShift}>
					Finish Shift
				</button>
			</div>
		);
	}
}