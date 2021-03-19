import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button, Input, Rate } from 'antd';

import { REDUCER, getMyClientList, orgLogin } from 'ducks/user';

const Search = Input.Search;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class MyClientListForm extends React.Component {
	state = {
		clients: [],
	};

	constructor(props) {
		super(props);

		this.showList();
	}

	showList = () => {
		var self = this;
		getMyClientList(result => {
			if (result.success) {
				var state = self.state;
				state.clients = result.data;
				self.setState(state);
			}
		});
	};

	goToOrganization = (appkey, rootUrl) => {
		orgLogin(appkey, result => {
			if (result.success) {
				if (!rootUrl.startsWith('http')) {
					rootUrl = 'http://' + rootUrl;
				}
				window.open(rootUrl + '?token=' + result.data.token);
			}
		});
	};

	goToCommentPage = clientId => {
		const { dispatch } = this.props;
		dispatch(push(`/client/comment/${clientId}`));
	};

	render() {
		const tableColumns = [
			{
				title: 'Domain',
				dataIndex: 'rootUrl',
				key: 'rootUrl',
				render: (rootUrl, record) => (
					<a
						href="javascript:void(0);"
						className="utils__link--blue"
						onClick={() => this.goToOrganization(record.appkey, rootUrl)}
					>
						{rootUrl}
					</a>
				),
			},
			{
				title: 'Type',
				dataIndex: 'type',
				key: 'type',
				render: text => {
					if (text === 1) {
						return 'Certified';
					}
					return 'Legacy';
				},
			},
			{
				title: 'Consistency',
				dataIndex: 'consistency',
				key: 'consistency',
				render: val => {
					if (!val) {
						return 100;
					}
					return val;
				},
			},
			{
				title: 'Rating',
				dataIndex: 'rating',
				key: 'rating',
				render: text => {
					let rating = text * 1;
					if (!text) {
						rating = 0;
					}

					return (
						<span>
							<Rate
								allowHalf
								disabled
								value={(Math.floor(rating) + Math.ceil(rating)) / 2}
							/>
							({rating})
						</span>
					);
				},
			},
			{
				title: 'Actions',
				key: 'actions',
				render: record => (
					<Button icon="form" onClick={() => this.goToCommentPage(record.clientId)}>
						Comments
					</Button>
				),
			},
		];

		return (
			<Card title="Select your organization to switch">
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
					dataSource={this.state.clients}
					rowKey="clientId"
					pagination={true}
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default MyClientListForm;
