import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import MyClientDetailForm from './MyClientDetailForm';

class MyClientDetailPage extends React.Component {
	static defaultProps = {
		pathName: 'MyClientDetail Page',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="MyClientDetail Page" />
				<MyClientDetailForm params={this.props.match.params} />
			</Page>
		);
	}
}

export default MyClientDetailPage;
