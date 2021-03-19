import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import EditForm from './EditForm';

class EditPage extends React.Component {
	static defaultProps = {
		pathName: 'Set Organization Weight',
		roles: [0, 1], // admin users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Set Weight" />
				<EditForm params={this.props.match.params} />
			</Page>
		);
	}
}

export default EditPage;
