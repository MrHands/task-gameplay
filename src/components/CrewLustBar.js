import React from 'react';
import CountUp from 'react-countup';

import LustBalancing from '../data/LustBalancing.json';
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
			shield,
		} = this.props;

		const widths = [];

		let xpCurrent = lust;
		let xpNext = 0;

		LustBalancing.lustLevelsXp.forEach((levelXp, index) => {
			const previous = (index > 0) ? LustBalancing.lustLevelsXp[index - 1] : 0;
			const needed = levelXp - previous;

			if (index === 0) {
				xpNext = levelXp;
			} else if (lust >= previous && lust < levelXp) {
				xpCurrent = lust - previous;
				xpNext = needed;
			}

			widths.push(Math.clamp(lust - previous, 0, needed) / needed * 100);
		});

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
						end={xpCurrent}
						duration={1}
						suffix={` / ${xpNext}`}
					/>
				</h3>
				<h3 className="o-crewLustBar__amount o-crewLustBar__amount--shield">
					<div className="o-crewLustBar__amount__title">Shield</div>
					<CountUp
					 	className="o-crewLustBar__amount__value"
						end={0}
						duration={1}
					/>
				</h3>
			</div>
		);
	}
}