import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button, Input } from 'antd';

import { REDUCER, getUserList } from 'ducks/user';

const Search = Input.Search;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class ListForm extends React.Component {
	state = {
		users: [],
	};

	constructor(props) {
		super(props);

		var self = this;
		getUserList(result => {
			if (result.success) {
				var state = self.state;
				state.users = result.data;
				self.setState(state);
			}
		});
	}

	goToDetailPage = username => {
		const { dispatch } = this.props;
		dispatch(push(`/users/detail/${username}`));
	};

	render() {
		const tableColumns = [
			{
				title: 'Username',
				dataIndex: 'username',
				key: 'username',
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
			},
			{
				title: 'First Name',
				dataIndex: 'firstname',
				key: 'firstname',
			},
			{
				title: 'Last Name',
				dataIndex: 'lastname',
				key: 'lastname',
			},
			{
				title: 'Merit Points',
				key: 'mp',
				render: record => {
					let rating = 0;
					record.clients.forEach(obj => {
						if (!isNaN(obj.rating)) {
							rating += obj.rating * 1;
						}
						if (!isNaN(obj.m2m_rating)) {
							rating += obj.m2m_rating * 1;
						}
					});
					return parseFloat(rating).toFixed(2);
				},
			},
			{
				title: 'Actions',
				key: 'actions',
				render: record => (
					<Button icon="search" onClick={() => this.goToDetailPage(record.username)}>
						View
					</Button>
				),
			},
		];

		return (
			<Card title="Users">
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
					dataSource={this.state.users}
					pagination={true}
					rowKey="username"
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default ListForm;
