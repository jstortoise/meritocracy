import { connect } from 'react-redux';
import { Card, Form, Input, Button } from 'antd';
import './style.scss';
import { REDUCER, getPwdResetLink } from '../../redux/ducks/auth';

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
@Form.create()
class ResetPassword extends React.Component {
    static async getInitialProps() {
        return { roles: [-1] };
    }

    onSubmit = isSubmitForm => event => {
        event.preventDefault();
        const { form, dispatch } = this.props;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
                    dispatch(getPwdResetLink(values['email']));
                }
            });
        }
    };

    render() {
        const { form, isSubmitForm } = this.props;
        return (
            <div className="reset-password">
                <Card title="Reset your password">
                    <Form hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                        <Form.Item label="Enter your email">
                            {form.getFieldDecorator('email', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input your email' }],
                            })(<Input type="email" size="default" />)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isSubmitForm}>Submit</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default ResetPassword;