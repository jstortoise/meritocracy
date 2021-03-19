import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button, Input } from 'antd';

import { REDUCER, getRates } from 'ducks/user';

const Search = Input.Search;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class DetailForm extends React.Component {
	state = {
		ratings: [],
	};

	constructor(props) {
		super(props);

		var self = this;
		const username = props.params.username;
		getRates(username, result => {
			if (result.success) {
				var state = self.state;
				state.ratings = result.data;
				self.setState(state);
			}
		});
	}

	goToDetailPage = clientId => {
		const { dispatch } = this.props;
		const username = this.props.params.username;
		dispatch(push(`/users/detail/${username}/score/${clientId}`));
	};

	render() {
		const tableColumns = [
			{
				title: 'Client ID',
				dataIndex: 'clientId',
				key: 'clientId',
			},
			{
				title: 'Domain',
				dataIndex: 'rootUrl',
				key: 'rootUrl',
			},
			{
				title: 'Total score',
				dataIndex: 'totalscore',
				key: 'totalscore',
				render: text => text + '%',
			},
			{
				title: 'Merit Point',
				dataIndex: 'rating',
				key: 'rating',
				align: 'center',
			},
			{
				title: 'Join date',
				dataIndex: 'joindate',
				key: 'joindate',
			},
			{
				title: 'Actions',
				key: 'actions',
				render: record => (
					<Button onClick={() => this.goToDetailPage(record.clientId)}>
						View scores
					</Button>
				),
			},
		];

		return (
			<Card title="Organizations">
				<div>
					<Search
						placeholder="Search..."
						style={{ width: 200, float: 'left' }}
						onSearch={value => console.log(value)}
					/>
					<br />
				</div>
				<Table
					columns={tableColumns}
					dataSource={this.state.ratings}
					pagination={true}
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default DetailForm;
