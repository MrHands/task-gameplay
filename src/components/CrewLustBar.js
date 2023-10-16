import React from 'react';
import CountUp from 'react-countup';

import './CrewLustBar.scss';

export default class CrewLustBar extends React.Component {
	constructor() {
		super();

		this.lustPrevious = {
			xpCurrent: 0,
			xpNext: 0,
			level: 0,
		};

		this.lustCurrent = {
			xpCurrent: 0,
			xpNext: 0,
			level: 0,
		};
	}

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
			shield,
			getLustLevel,
			moodEffect,
		} = this.props;

		this.lustPrevious = JSON.parse(JSON.stringify(this.lustCurrent));
		this.lustCurrent = getLustLevel(lust);

		let xpFrom = this.lustPrevious.xpCurrent;
		const xpTo = this.lustCurrent.xpCurrent;

		if (this.lustCurrent.level !== this.lustPrevious.level) {
			xpFrom = 0;
		}

		const widths = [];

		for (let i = 0; i < this.lustCurrent.level; ++i) {
			widths[i] = 100;
		}
		widths[this.lustCurrent.level] = (this.lustCurrent.xpCurrent / this.lustCurrent.xpNext) * 100;

		return (
			<div
				className={this.classes.join(' ')}
			>
				<h2 className="o-crewLustBar__title">{name}</h2>
				<div className="o-crewLustBar__hearts">
					<div className="o-crewLustBar__bar o-crewLustBar__bar--heart" style={{'--filled': `${widths[0]}%`}}>
						<div className="o-crewLustBar__bar__foreground"></div>
					</div>
					<div className="o-crewLustBar__bar o-crewLustBar__bar--heart o-crewLustBar__bar--orgasm" style={{'--filled': `${widths[1]}%`}}>
						<div className="o-crewLustBar__bar__foreground"></div>
					</div>
					<div className="o-crewLustBar__bar o-crewLustBar__bar--heart o-crewLustBar__bar--orgasm" style={{'--filled': `${widths[2]}%`}}>
						<div className="o-crewLustBar__bar__foreground"></div>
					</div>
					<div className="o-crewLustBar__bar o-crewLustBar__bar--heart o-crewLustBar__bar--orgasm" style={{'--filled': `${widths[3]}%`}}>
						<div className="o-crewLustBar__bar__foreground"></div>
					</div>
				</div>
				<div className="o-crewLustBar__bar o-crewLustBar__bar--shield" style={{'--filled': `${(shield / 5) * 100}%`}}>
					<div className="o-crewLustBar__bar__foreground"></div>
				</div>
				<h3 className="o-crewLustBar__amount o-crewLustBar__amount--lust">
					<div className="o-crewLustBar__amount__title">LUST</div>
					<CountUp
					 	className="o-crewLustBar__amount__value"
						start={xpFrom}
						end={xpTo}
						duration={1}
						suffix={` / ${this.lustCurrent.xpNext}`}
					/>
				</h3>
				<h3 className="o-crewLustBar__amount o-crewLustBar__amount--shield">
					<div className="o-crewLustBar__amount__title">Shield</div>
					<CountUp
					 	className="o-crewLustBar__amount__value"
						end={shield}
						duration={1}
					/>
				</h3>
				<p className="o-crewLustBar__effect">INTENT: {moodEffect}</p>
			</div>
		);
	}
}