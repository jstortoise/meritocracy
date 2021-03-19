import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import AddForm from './AddForm';

class AddPage extends React.Component {
	static defaultProps = {
		pathName: 'Add Organization',
		roles: [0, 1], // admin users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Add Organization Page" />
				<AddForm />
			</Page>
		);
	}
}

export default AddPage;
