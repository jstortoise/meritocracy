import React from 'react';

class Error extends React.Component {
	static getInitialProps({ res, err }) {
		const statusCode = res ? res.statusCode : err ? err.statusCode : null;
		return { statusCode };
	}

	render() {
		return (
			<p>
				{this.props.statusCode
					? `${this.props.statusCode} | This page could not be found`
					: 'This page could not be found'}
			</p>
		);
	}
}

export default Error;