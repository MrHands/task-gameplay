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
			shield,
			getLustLevel,
		} = this.props;

		const lustLevel = getLustLevel(lust);

		const widths = [];

		for (let i = 0; i < lustLevel.level; ++i) {
			widths[i] = 100;
		}
		widths[lustLevel.level] = (lustLevel.xpCurrent / lustLevel.xpNext) * 100;

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
						end={lustLevel.xpCurrent}
						duration={1}
						suffix={` / ${lustLevel.xpNext}`}
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