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

		const classes = ['m-carousel', this.props.className].join(' ');
		return (<div className={classes}>
			{outcomes.map((outcome, index) => <div className="m-carousel__item" key={`outcome-${index}`}></div>)}
		</div>);
	}
}