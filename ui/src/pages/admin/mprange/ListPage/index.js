import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import ListForm from './ListForm';

class ListPage extends React.Component {
	static defaultProps = {
		pathName: 'Organizations',
		roles: [0, 1], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Organization Merit Points" />
				<ListForm />
			</Page>
		);
	}
}

export default ListPage;
