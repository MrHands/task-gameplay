import React from 'react';

import DraggableCard from './DraggableCard';

import './Dice.scss';

export default class Dice extends React.Component {
	render() {
		return (
			<DraggableCard className="o-dice" {...this.props}>
				1
			</DraggableCard>
		)
	}
}