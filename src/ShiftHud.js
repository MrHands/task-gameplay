import React from 'react';

import './ShiftHud.css';

export default class ShiftHud extends React.Component {
	render() {
		const {
			characters,
			handleStartShift
		} = this.props;

		let disabled;

		const withCards = characters.filter(character => character.card);
		if (withCards.length === characters.length) {
			disabled = '';
		} else {
			disabled = 'disabled';
		}

		return (
			<div className="m-shiftHud">
				<button onClick={handleStartShift}>
					Start Shift
				</button>
			</div>
		);
	}
}