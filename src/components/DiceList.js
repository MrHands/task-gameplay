import React from 'react';

import Dice from './Dice';

import './DiceList.scss';

export default class DiceList extends React.Component {
	get classes() {
		const classes = [
			'm-diceList',
			this.props.className,
		];

		return classes;
	}

	render() {
		const {
			dice,
		} = this.props;
	
		return (
			<div className={this.classes.join(' ')}>
				{dice.map(({ value, id }, index) => {
					return <Dice
						key={`dice-${index}`}
						value={value}
						id={id}
					/>;
				})}
			</div>
		)
	}
}