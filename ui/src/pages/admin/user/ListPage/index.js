import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import ListForm from './ListForm';

class ListPage extends React.Component {
	static defaultProps = {
		pathName: 'User List',
		roles: [0, 1], // admin users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="User List" />
				<ListForm />
			</Page>
		);
	}
}

export default ListPage;
