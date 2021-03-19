import { connect } from 'react-redux';
import Link from 'next/link';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import logo from '../public/static/images/logo.svg';
import { REDUCER, login, getCaptcha } from '../redux/ducks/auth';
import { API_URL } from '../redux/api/common';
import './style.scss';

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
@Form.create()
class Login extends React.Component {
    state = {
        isFacebookSubmit: false,
        isLoginSubmit: false,
        captcha: {},
        loadingCaptcha: false
    };

    static async getInitialProps() {
        return { roles: [-1] };
    }

    componentDidMount() {
        this.getCaptcha();
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

    onFbLogin = isSubmitForm => () => {
        const { dispatch } = this.props;
        if (!isSubmitForm) {
            this.showFbLogin(token => {
                this.setState({ isLoginSubmit: false, isFacebookSubmit: true });
                dispatch(login({ fbToken: token }));
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
                        dispatch(login(values));
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

    render() {
        const { form, isSubmitForm } = this.props;
        const { isLoginSubmit, isFacebookSubmit, captcha, loadingCaptcha } = this.state;

        return (
            <div className="main-login">
                <div className="main-login__block">
                    <div className="main-login__block__form">
                        <img src={logo} alt="LOGO" className="logo" />
                        <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                            <Form.Item label="Username / MID / Email">
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

                            <div className="text-center">
                                You can also Login through
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
                                <Button className="btn-social btn-facebook" onClick={this.onFbLogin(isSubmitForm)} loading={isFacebookSubmit && isSubmitForm}>
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

                            <div className="remember-me">
                                <Checkbox>Remember me?</Checkbox>
                            </div>

                            <div className="main-login__block__no-account">
                                <div>Forgot password?</div>
                                <Link href="/forgot">
                                    <a>Reset your password</a>
                                </Link>
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
                                    LOGIN
                                </Button>
                            </div>

                        </Form>
                    </div>
                    <div className="main-login__block__no-account">
                        <div>Don't have an account?</div>
                        <Link href="/signup">
                            <a>Register for free</a>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;