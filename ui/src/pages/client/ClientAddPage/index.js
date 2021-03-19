import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import ClientAddForm from './ClientAddForm';

class ClientAddPage extends React.Component {
	static defaultProps = {
		pathName: 'Add Organization',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Add Organization Page" />
				<ClientAddForm />
			</Page>
		);
	}
}

export default ClientAddPage;
