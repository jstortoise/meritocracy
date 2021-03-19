import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import ClientDetailForm from './ClientDetailForm';

class ClientDetailPage extends React.Component {
	static defaultProps = {
		pathName: 'Organization Stats',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Organization Detail Page" />
				<ClientDetailForm params={this.props.match.params} />
			</Page>
		);
	}
}

export default ClientDetailPage;
