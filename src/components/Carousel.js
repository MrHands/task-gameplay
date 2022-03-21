import React from 'react';

import { TaskOutcome } from '../enums/TaskOutcome';

import './Carousel.css';

export default class Carousel extends React.Component {
	render() {
		const {
			difficulty,
			bonus,
			roll
		} = this.props;

		const outcomes = [];

		for (let i = 0; i < 20; ++i) {
			if (i === 19) {
				outcomes.push(TaskOutcome.CRITICAL_SUCCESS);
			} else if (i < difficulty - bonus) {
				outcomes.push(TaskOutcome.FAIL);
			} else {
				outcomes.push(TaskOutcome.SUCCESS);
			}
		}

		return (<div className={['m-carousel', this.props.className].join(' ')}>
			{outcomes.map((outcome, index) => {
				const classes = ['m-carousel__item', `-${outcome.toLowerCase()}`];

				if (roll === -1) {
					if (index >= difficulty - bonus && index < difficulty) {
						classes.push('-selected');
					}
				} else if (index === roll) {
					classes.push('-selected');
				}

				return <div className={classes.join(' ')} key={`outcome-${index}`}></div>
			})}
		</div>);
	}
}