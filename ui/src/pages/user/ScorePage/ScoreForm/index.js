import React from 'react';
import { Table, Input } from 'antd';

import { getScores } from 'ducks/user';

const Search = Input.Search;

class ScoreForm extends React.Component {
	state = {
		details: [],
		total: 0,
	};

	constructor(props) {
		super(props);

		var self = this;

		const username = props.params.username;
		const clientId = props.params.clientId;

		getScores(username, clientId, result => {
			if (result.success) {
				var state = self.state;
				state.details = result.data;
				state.total = result.total;
				self.setState(state);
			}
		});
	}

	render() {
		const tableColumns = [
			{
				title: 'Quiz',
				dataIndex: 'key',
				key: 'key',
			},
			{
				title: 'Score',
				dataIndex: 'value',
				key: 'value',
			},
		];

		return (
			<div>
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-header">
								<div className="utils__title">Scores</div>
								<br />
								<Search
									placeholder="Search..."
									style={{ width: 200, float: 'left' }}
									onSearch={value => console.log(value)}
								/>
								<p style={{ float: 'right' }}>Total score: {this.state.total}%</p>
							</div>
							<div className="card-body">
								<div className="col-12" />
								<Table
									columns={tableColumns}
									dataSource={this.state.details}
									pagination={true}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ScoreForm;
