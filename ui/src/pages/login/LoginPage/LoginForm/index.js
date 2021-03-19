import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import meritocracy_logo from '../../../../resources/images/meritocracy_logo.svg';
import login_button_bg from '../../../../resources/images/login_button_bg.svg';
import GoogleLogo from '../../../../resources/images/google.svg';
import TwitterLogo from '../../../../resources/images/twitter.svg';
import FacebookLogo from '../../../../resources/images/facebook.svg';
import InstagramLogo from '../../../../resources/images/instagram.svg';
import RecaptchaLogo from '../../../../resources/images/220px-RecaptchaLogo.svg.png';
import { REDUCER, login, showFbLogin } from 'ducks/auth';
import './style.scss';

const FormItem = Form.Item;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class LoginForm extends React.Component {
	static defaultProps = {};

	// $FlowFixMe
	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					dispatch(login(values));
				}
			});
		}
	};

	onFbLogin = () => {
		const { dispatch } = this.props;
		showFbLogin(token => {
			dispatch(login({ fbToken: token }));
		});
	};

	render() {
		const { form, isSubmitForm } = this.props;

		return (
			<div className="cat__pages__login__block__form">
				<img src={meritocracy_logo} alt="LOGO" className="logo" />
				<Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
					<FormItem label="Username / MID / Email">
						{form.getFieldDecorator('username', {
							initialValue: '',
							rules: [{ required: true, message: 'Please input your username' }],
						})(<Input size="default" />)}
					</FormItem>

					<FormItem label="Password">
						{form.getFieldDecorator('password', {
							initialValue: '',
							rules: [{ required: true, message: 'Please input your password' }],
						})(<Input size="default" type="password" />)}
					</FormItem>

					<div className="social-text">
						You can also Login through your favorite Social Network
					</div>

					<div className="social-login">
						<Button className="social-button">
							<div className="social-icon">
								<img src={GoogleLogo} alt="Login with Google" />
							</div>

							<div className="social-label">Google</div>
						</Button>

						<Button
							className="social-button"
							style={{ backgroundColor: '#00C2FF', color: 'white' }}
						>
							<div className="social-icon">
								<img src={TwitterLogo} alt="Login with Twitter" />
							</div>

							<div className="social-label">Twitter</div>
						</Button>

						<Button
							className="social-button"
							style={{ backgroundColor: '#4267B1', color: 'white' }}
							onClick={this.onFbLogin}
						>
							<div className="social-icon">
								<img src={FacebookLogo} alt="Login with Facebook" />
							</div>

							<div className="social-label">Facebook</div>
						</Button>

						<Button className="social-button">
							<div className="social-icon">
								<img src={InstagramLogo} alt="Login with Instagram" />
							</div>

							<div className="social-label">Instagram</div>
						</Button>
					</div>

					<div className="recaptcha">
						<div>
							<Checkbox className="recaptcha__checkbox">I'm not a robot</Checkbox>
						</div>

						<img src={RecaptchaLogo} alt="recaptcha" className="recaptcha__logo" />
					</div>

					<div className="remember-me">
						<Checkbox>Remember me?</Checkbox>
					</div>

					<div className="form-actions login">
						<Button
							type="primary"
							className="width-150 login__button"
							size="large"
							shape="round"
							htmlType="submit"
							loading={isSubmitForm}
						>
							Login
						</Button>
					</div>
				</Form>
			</div>
		);
	}
}

export default LoginForm;
