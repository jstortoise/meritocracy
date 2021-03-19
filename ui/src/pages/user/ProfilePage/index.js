import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import UserProfileForm from './UserProfileForm';

class UserProfilePage extends React.Component {
	static defaultProps = {
		pathName: 'User Profile',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="User Profile Page" />
				<UserProfileForm />
			</Page>
		);
	}
}

export default UserProfilePage;
