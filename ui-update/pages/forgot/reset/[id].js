import { connect } from 'react-redux';
import Router, { useRouter } from 'next/router';
import { Card, Form, Input, Button, notification } from 'antd';
import { REDUCER, resetPassword, checkPwdResetLink } from '../../../redux/ducks/auth';
import '../style.scss';

const ResetPsswordWithRouter = props => {
    const router = useRouter();
    return (<ResetPassword {...props} router={router}/>);
};

ResetPsswordWithRouter.getInitialProps = async () => {
    return { roles: [-1] };
};

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
@Form.create()
class ResetPassword extends React.Component {
    componentDidMount() {
        const { router } = this.props;
        const { id: resetId } = router.query;
        checkPwdResetLink(resetId, res => {
            if (!res.success) {
                notification.open({ type: 'error', message: 'Invalid password reset link. Please try again' });
                Router.push('/forgot');
            }
        });
    }

    onSubmit = isSubmitForm => event => {
        event.preventDefault();
        const { form, dispatch, router } = this.props;
        const { id: resetId } = router.query;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
                    dispatch(resetPassword(resetId, values));
                }
            });
        }
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
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
                                rules: [{
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                }, {
                                    required: true,
                                    message: 'Please input your email'
                                }],
                            })(<Input size="default" />)}
                        </Form.Item>
                        <Form.Item label="Enter your password">
                            {form.getFieldDecorator('password', {
                                initialValue: '',
                                rules: [{
                                    required: true,
                                    message: 'Please input your password'
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(<Input type="password" size="default" />)}
                        </Form.Item>
                        <Form.Item label="Confirm your password">
                            {form.getFieldDecorator('confirm', {
                                initialValue: '',
                                rules: [{
                                    validator: this.compareToFirstPassword,
                                }],
                            })(<Input type="password" size="default" />)}
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

export default ResetPsswordWithRouter;