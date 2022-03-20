import React from 'react';

import { TaskOutcome } from './TaskOutcome';

import './Carousel.css';

export default class Carousel extends React.Component {
	render() {
		const outcomes = [
			TaskOutcome.CRITIAL_FAIL,
			TaskOutcome.FAIL,
			TaskOutcome.FAIL,
			TaskOutcome.FAIL,
			TaskOutcome.FAIL,

			TaskOutcome.FAIL,
			TaskOutcome.FAIL,
			TaskOutcome.FAIL,
			TaskOutcome.FAIL,
			TaskOutcome.FAIL,

			TaskOutcome.SUCCESS,
			TaskOutcome.SUCCESS,
			TaskOutcome.SUCCESS,
			TaskOutcome.SUCCESS,
			TaskOutcome.SUCCESS,

			TaskOutcome.SUCCESS,
			TaskOutcome.SUCCESS,
			TaskOutcome.SUCCESS,
			TaskOutcome.SUCCESS,
			TaskOutcome.CRITICAL_SUCCESS,
		];

		return (<div className={['m-carousel', this.props.className].join(' ')}>
			{outcomes.map((outcome, index) => {
				const classes = ['m-carousel__item', `-${outcome.toLowerCase()}`].join(' ');

				return <div className={classes} key={`outcome-${index}`}></div>
			})}
		</div>);
	}
}