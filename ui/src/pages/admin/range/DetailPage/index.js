import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import DetailForm from './DetailForm';

class DetailPage extends React.Component {
	static defaultProps = {
		pathName: 'Organization Merit Points Range Detail',
		roles: [0, 1], // admin users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Detail Page" />
				<DetailForm params={this.props.match.params} />
			</Page>
		);
	}
}

export default DetailPage;
