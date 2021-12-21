import React from 'react';

import './ShiftHud.css';

export default class ShiftHud extends React.Component {
	render() {
		const {
			characters,
			handleStartShift
		} = this.props;

		const withCards = characters.filter(character => character.card);
		let disabled;
		if (withCards.length === characters.length) {
			disabled = '';
		} else {
			disabled = 'disabled';
		}

		return (
			<div className="m-shiftHud">
				<h3 className="a-explain">All characters must be assigned a task for their shift</h3>
				<button onClick={handleStartShift} disabled={disabled}>
					Start Shift
				</button>
			</div>
		);
	}
}