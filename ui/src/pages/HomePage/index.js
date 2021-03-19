import React from 'react';
import Page from 'components/LayoutComponents/Page';

class HomePage extends React.Component {
	static defaultProps = {
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return <Page {...props} />;
	}
}

export default HomePage;
