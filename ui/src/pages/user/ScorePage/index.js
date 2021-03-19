import React from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import ScoreForm from './ScoreForm';

class ScorePage extends React.Component {
	static defaultProps = {
		pathName: 'User scores',
		roles: [0, 1, 2, 3], // all users
	};

	render() {
		const props = this.props;
		return (
			<Page {...props}>
				<Helmet title="User Scores" />
				<ScoreForm params={this.props.match.params} />
			</Page>
		);
	}
}

export default ScorePage;
