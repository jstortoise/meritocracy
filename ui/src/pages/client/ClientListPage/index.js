import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import ClientListForm from './ClientListForm';

class ClientListPage extends React.Component {
	static defaultProps = {
		pathName: 'Organizations',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Organization List" />
				<ClientListForm />
			</Page>
		);
	}
}

export default ClientListPage;
