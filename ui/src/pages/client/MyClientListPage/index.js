import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import MyClientListForm from './MyClientListForm';

class MyClientListPage extends React.Component {
	static defaultProps = {
		pathName: 'My Organizations',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="My Organizations" />
				<MyClientListForm />
			</Page>
		);
	}
}

export default MyClientListPage;
