import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import ListForm from './ListForm';

class ListPage extends React.Component {
	static defaultProps = {
		pathName: 'Users',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Users" />
				<ListForm />
			</Page>
		);
	}
}

export default ListPage;
