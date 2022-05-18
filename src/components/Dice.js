import React from 'react';
import DraggableDice from './DraggableDice';

import './Dice.scss';

export default class Dice extends React.Component {
	render() {
		const {
			value,
		} = this.props;
	
		return (
			<DraggableDice className="o-dice" {...this.props}>
				{value}
			</DraggableDice>
		)
	}
}