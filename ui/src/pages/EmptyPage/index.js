import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import Empty from './Empty';

class EmptyPage extends React.Component {
	static defaultProps = {
		pathName: 'Empty Page',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Empty Page" />
				<Empty />
			</Page>
		);
	}
}

export default EmptyPage;
