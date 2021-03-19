import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import CommentForm from './CommentForm';

class CommentPage extends React.Component {
	static defaultProps = {
		pathName: 'Comment Page',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="Comment Page" />
				<CommentForm params={this.props.match.params} />
			</Page>
		);
	}
}

export default CommentPage;
