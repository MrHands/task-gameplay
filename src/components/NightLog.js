import React from 'react';
import ReactMarkdown from 'react-markdown';

import './NightLog.scss';

export default class NightLog extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-nightLog'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			nightLog,
		} = this.props;

		return (
			<div className={this.classes.join(' ')}>
				{nightLog.map(entry => <ReactMarkdown>{entry}</ReactMarkdown>)}
			</div>
		);
	}
}