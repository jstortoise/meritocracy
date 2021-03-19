import React from 'react';
import { Card } from 'antd';

import { editRange, getRangeDetail } from 'ducks/range';

import '../../style.scss';

class DetailForm extends React.Component {
	state = {
		description: '',
		unit: '',
		fields: [],
	};

	constructor(props) {
		super(props);

		this.getDetail();
	}

	getDetail = () => {
		const type = this.props.params.type;
		var self = this;
		getRangeDetail(type, result => {
			if (result.success) {
				var state = self.state;
				if (result.data) {
					state.fields = result.data.fields;
					state.description = result.data.description;
					state.unit = result.data.unit;
					self.setState(state);
				}
			}
		});
	};

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		const type = this.props.params.type;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					dispatch(editRange(type, values));
				}
			});
		}
	};

	render() {
		const type = this.props.params.type * 1;
		let typeLabel = '';
		if (type === 0) {
			typeLabel = 'Organization Merit Points Range';
		} else if (type === 1) {
			typeLabel = 'Member Total Score Range';
		} else if (type === 2) {
			typeLabel = 'Member Merit Points Range';
		} else if (type === 3) {
			typeLabel = 'Organization Total Score Range';
		}

		const getFields = () => {
			let items = [];
			for (let i = 0; i < this.state.fields.length; i++) {
				items.push(
					<p key={i}>
						{this.state.fields[i].name}:{' '}
						<strong>{this.state.fields[i].displayname}</strong>
					</p>,
				);
			}
			return items;
		};

		return (
			<div>
				<Card title="Range Details">
					<p>
						Type: <strong>{typeLabel}</strong>
					</p>
					<p>
						Description: <strong>{this.state.description}</strong>
					</p>
					{getFields()}
				</Card>
			</div>
		);
	}
}

export default DetailForm;
