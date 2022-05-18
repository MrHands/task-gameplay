import React from 'react';
import DraggableDice from './DraggableDice';

import './Dice.scss';

export default class Dice extends React.Component {
	get classes() {
		const classes = [
			'a-dice',
			this.props.className,
		];

		return classes;
	}

	render() {
		const {
			value,
		} = this.props;
	
		return (
			<DraggableDice className={this.classes.join(' ')} {...this.props}>
				{value}
			</DraggableDice>
		)
	}
}