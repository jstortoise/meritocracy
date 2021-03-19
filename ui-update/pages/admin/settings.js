import { connect } from 'react-redux';
import { Card, Form, InputNumber, Button } from 'antd';
import { REDUCER, getSettings, updateSettings } from '../../redux/ducks/auth';

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
@Form.create()
class Settings extends React.Component {
    state = {
        accessTokenLifespan: 0, // token life span
        tokenPerTip: 0,
        tipAmountAccumulation: 0,
        loading: false,
    };

    static async getInitialProps() {
        return { roles: [0, 1] };
    }

    componentDidMount() {
        this.setState({ loading: true }, () => {
            getSettings(res => {
                var state = this.state;
                state.loading = false;
                if (res.success) {
                    state = res.data;
                }
                this.setState(state);
            })
        });
    }
    
	onSubmit = isSubmitForm => event => {
        event.preventDefault();
        const { form, dispatch } = this.props;
        if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
                    values['accessTokenLifespan'] *= 60;
                    dispatch(updateSettings(values));
				}
			});
		}
    };

    validateNumber = (rule, value, callback) => {
        if (value <= 0) {
            callback('Timeout value should be more than 0');
        } else if ((value * 10) % 10 > 0){
            callback('Value should be integer');
        } else {
            callback();
        }
    };

    render() {
        const { form, isSubmitForm } = this.props;

        return (
            <Card title="Settings" style={{ maxWidth: 300 }} loading={this.state.loading}>
                <Form hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                    <Form.Item label="Access Token Lifespan (Minutes)">
                        {form.getFieldDecorator('accessTokenLifespan', {
                            initialValue: `${this.state.accessTokenLifespan / 60}`,
                            rules: [{
                                required: true,
                                message: 'Please input value'
                            }, {
                                validator: this.validateNumber,
                            }],
                        })(<InputNumber size="default" min={1} />)}
                    </Form.Item>
                    <Form.Item label="Token Amount Per Tip">
                        {form.getFieldDecorator('tokenPerTip', {
                            initialValue: `${this.state.tokenPerTip}`,
                            rules: [{
                                required: true,
                                message: 'Please input value'
                            }, {
                                validator: this.validateNumber,
                            }],
                        })(<InputNumber size="default" min={0} />)}
                    </Form.Item>
                    <Form.Item label="Tip Amount Accummulated">
                        {form.getFieldDecorator('tipAmountAccumulation', {
                            initialValue: `${this.state.tipAmountAccumulation}`,
                            rules: [{
                                required: true,
                                message: 'Please input value'
                            }, {
                                validator: this.validateNumber,
                            }],
                        })(<InputNumber size="default" min={0} />)}
                    </Form.Item>
                    <Button
                        type="primary"
                        shape="round"
                        htmlType="submit"
                        loading={isSubmitForm}
                    >
                        Update Settings
                    </Button>
                </Form>
            </Card>
        );
    }
}

export default Settings;