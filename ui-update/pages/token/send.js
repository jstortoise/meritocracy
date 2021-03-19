import { connect } from 'react-redux';
import { Card, Form, Input, InputNumber, Button } from 'antd';
import { REDUCER, sendTokenTo } from '../../redux/ducks/auth';

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
@Form.create()
class SendToken extends React.Component {
    static async getInitialProps() {
        return { roles: [0, 1] };
    }
    
	onSubmit = isSubmitForm => event => {
        event.preventDefault();
        const { form, dispatch } = this.props;
        if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
                    dispatch(sendTokenTo(values));
				}
			});
		}
    };

    validateNumber = (rule, value, callback) => {
        if (value <= 0) {
            callback('Amount should be more than 0');
        } else {
            callback();
        }
    };

    render() {
        const { form, isSubmitForm } = this.props;

        return (
            <Card title="Settings" style={{ maxWidth: 300 }}>
                <Form hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                    <Form.Item label="To">
                        {form.getFieldDecorator('userId', {
                            rules: [{
                                required: true,
                                message: 'Please input user MID here to send token'
                            }],
                        })(<Input placeholder="Please input user MID here to send token" />)}
                    </Form.Item>
                    <Form.Item label="Amount">
                        {form.getFieldDecorator('amount', {
                            rules: [{
                                required: true,
                                message: 'Please input token amount'
                            }, {
                                validator: this.validateNumber,
                            }],
                        })(<InputNumber placeholder="Please input token amount" min={1} />)}
                    </Form.Item>
                    <Button
                        type="primary"
                        shape="round"
                        htmlType="submit"
                        loading={isSubmitForm}
                    >
                        Send Token
                    </Button>
                </Form>
            </Card>
        );
    }
}

export default SendToken;