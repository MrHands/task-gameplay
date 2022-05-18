import React from 'react';

import DraggableCard from './DraggableCard';

import './Dice.scss';

export default class Dice extends React.Component {
	render() {
		const {
			value
		} = this.props;

		return (
			<DraggableCard className="o-dice" {...this.props}>
				{value}
			</DraggableCard>
		)
	}
}