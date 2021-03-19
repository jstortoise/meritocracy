import { connect } from 'react-redux';
import Link from 'next/link';
import { Form, Input, Button, notification } from 'antd';
import { REDUCER, signup, fbSignup, getCaptcha } from '../redux/ducks/auth';
import { API_URL } from '../redux/api/common';
import './style.scss';

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
@Form.create()
class Signup extends React.Component {
    state = {
        isFacebookSubmit: false,
        isLoginSubmit: false,
        captcha: {},
        loadingCaptcha: false
    };

    static async getInitialProps() {
        return { roles: [-1] };
    }

    showFbLogin = callback => {
        var win = window.open(API_URL + '/social/facebook/login/null');
        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventer = window[eventMethod];
        var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
        // Listen to message from child window
    
        var fbToken = null;
        eventer(
            messageEvent,
            e => {
                fbToken = e.data;
            },
            false,
        );
    
        // check if child window is closed
        var timer = setInterval(() => {
            if (win.closed) {
                callback(fbToken);
                clearInterval(timer);
            }
        }, 500);
    };

    onFbSignup = isSubmitForm => () => {
        if (!isSubmitForm) {
            const { dispatch } = this.props;
            this.showFbLogin(token => {
                this.setState({ isLoginSubmit: false, isFacebookSubmit: true });
                dispatch(fbSignup({ fbToken: token }));
            });
        }
    };

	onSubmit = isSubmitForm => event => {
        event.preventDefault();
        const { form, dispatch } = this.props;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
                    if (values['captcha'] === this.state.captcha.text) {
                        this.setState({ isLoginSubmit: true, isFacebookSubmit: false });
                        dispatch(signup(values));
                    } else {
                        notification.open({ type: 'error', message: 'Invalid captcha' });
                    }
				}
			});
		}
    };

    getCaptcha = () => {
        this.setState({ loadingCaptcha: true });
        getCaptcha(res => {
            if (res.success) {
                this.setState({ captcha: res.data, loadingCaptcha: false });
            }
        });
    };

    componentDidMount() {
        this.getCaptcha();
    }

    render() {
        const { form, isSubmitForm } = this.props;
        const { isLoginSubmit, isFacebookSubmit, captcha, loadingCaptcha } = this.state;

        return (
            <div className="main-login">
                <div className="main-login__block">
                    <div className="main-login__block__form">
                        <h2>PLEASE SIGNUP HERE</h2>
                        <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                            <Form.Item label="First Name">
                                {form.getFieldDecorator('firstName')(<Input size="default" />)}
                            </Form.Item>
                            <Form.Item label="Last Name">
                                {form.getFieldDecorator('lastName')(<Input size="default" />)}
                            </Form.Item>
                            <Form.Item label="Username">
                                {form.getFieldDecorator('username', {
                                    initialValue: '',
                                    rules: [{ required: true, message: 'Please input your username' }],
                                })(<Input size="default" />)}
                            </Form.Item>
                            <Form.Item label="Password">
                                {form.getFieldDecorator('password', {
                                    initialValue: '',
                                    rules: [{ required: true, message: 'Please input your password' }],
                                })(<Input size="default" type="password" />)}
                            </Form.Item>
                            <Form.Item label="Email">
                                {form.getFieldDecorator('email', {
                                    initialValue: '',
                                    rules: [{ required: true, message: 'Please input your email' }],
                                })(<Input size="default" type="email" />)}
                            </Form.Item>

                            <div className="text-center">
                                You can also Signup through
                                <br/>
                                your favorite Social Network
                            </div>

                            <div className="social-btn-group">
                                <Button className="btn-social btn-google">
                                    Google
                                </Button>
                                <Button className="btn-social btn-twitter">
                                    Twitter
                                </Button>
                                <Button className="btn-social btn-facebook" onClick={this.onFbSignup(isSubmitForm)} loading={isFacebookSubmit && isSubmitForm}>
                                    Facebook
                                </Button>
                                <Button className="btn-social btn-instagram">
                                    Instagram
                                </Button>
                            </div>

                            <div className="captcha">
                                <div className="captcha-image">
                                    <div dangerouslySetInnerHTML={{ __html: captcha.data }}/>
                                    <Button icon={loadingCaptcha ? "loading" : "reload"} onClick={this.getCaptcha} />
                                </div>
                                <Form.Item>
                                    {form.getFieldDecorator('captcha', {
                                        initialValue: '',
                                        rules: [{ required: true, message: 'Enter the characters you see' }],
                                    })(<Input size="default" />)}
                                </Form.Item>
                            </div>

                            <div className="form-actions">
                                <Button
                                    type="primary"
                                    className="btn-purple"
                                    size="large"
                                    shape="round"
                                    htmlType="submit"
                                    loading={isLoginSubmit && isSubmitForm}
                                >
                                    SIGN UP
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <div className="main-login__block__no-account">
                        <div>Already have an account?</div>
                        <Link href="/login">
                            <a>Click here to login</a>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;