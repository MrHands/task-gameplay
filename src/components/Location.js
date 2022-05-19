import React from 'react';

import './Location.scss';

export default class Location extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-location'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			location,
		} = this.props;

		/* let diceDropped = null;

		if (dice !== null) {
			diceDropped = (
				<Dice
					id={dice.id}
					value={dice.value}
				/>
			);
		} else {
			diceDropped = (
				<DroppableDice className="m-dice -empty" {...this.props}>
					<h3 className="o-character__title">Drag character here</h3>
				</DroppableCard>
			);
		} */

		return (
			<div className={this.classes.join(' ')}>
				<h2 className="m-location__title">{location.title}</h2>
			</div>
		);
	}
}