import React from 'react';
import CountUp from 'react-countup';

import './CrewLustBar.scss';

export default class CrewLustBar extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['o-crewLustBar'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			name,
			lust,
		} = this.props;

		const lustWidth = Math.min(lust, 100);
		const heartWidth = Math.clamp(lust - 100, 0, 100);

		return (
			<div
				className={this.classes.join(' ')}
			>
				<h2 className="o-crewLustBar__title">{name}</h2>
				<div className="o-crewLustBar__container">
					<div className="o-crewLustBar__bar" style={{'--lust-width': `${lustWidth}%`}}>
						<div className="o-crewLustBar__bar__foreground"></div>
					</div>
					<div className="o-crewLustBar__hearts">
						<div className="o-crewLustBar__bar" style={{'--lust-width': `${lustWidth}%`}}>
							<div className="o-crewLustBar__bar__foreground"></div>
						</div>
						<div className="o-crewLustBar__bar" style={{'--lust-width': `${heartWidth}%`}}>
							<div className="o-crewLustBar__bar__foreground"></div>
						</div>
						<div className="o-crewLustBar__bar" style={{'--lust-width': heartWidth}}>
							<div className="o-crewLustBar__bar__foreground"></div>
						</div>
						<div className="o-crewLustBar__bar" style={{'--lust-width': heartWidth}}>
							<div className="o-crewLustBar__bar__foreground"></div>
						</div>
					</div>
				</div>
				<h2 className="o-crewLustBar__amount">
					<CountUp
						end={lust}
						duration={1}
						suffix="%"
					/>
				</h2>
			</div>
		);
	}
}