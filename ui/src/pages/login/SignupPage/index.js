import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import SignupForm from './SignupForm';
import '../style.scss';

const getParamsFromQuery = () => {
	let query = window.location.href.split('?');
	let params = {};
	if (query.length > 1) {
		let queryStr = query[1];
		let paramStrs = queryStr.split('&');

		if (paramStrs.length > 0) {
			paramStrs.forEach(paramStr => {
				let paramFields = paramStr.split('=');
				if (paramFields.length > 1) {
					params[paramFields[0]] = paramFields[1];
				}
			});
		}
	}
	return params;
};

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms['login'],
});

@connect(mapStateToProps)
class SignupPage extends React.Component {
	state = {};

	componentDidMount() {
		document.getElementsByTagName('body')[0].style.overflow = 'hidden';
	}

	componentWillUnmount() {
		document.getElementsByTagName('body')[0].style.overflow = '';
	}

	goToLogin = () => {
		let params = getParamsFromQuery();
		let query = '';
		if (params.redirect_uri) {
			query += '?redirect_uri=' + params.redirect_uri;
			if (params.action) {
				query += '&action=' + params.action;
			}
			if (params.appkey) {
				query += '&appkey=' + params.appkey;
			}
		}

		const { dispatch } = this.props;
		dispatch(push('/login' + query));
	};

	render() {
		const { match, ...props } = this.props;
		return (
			<Page {...props}>
				<Helmet title="Signup" />
				<div className="main-login main-login--fullscreen">
					<div className="main-login__header">
						<div className="row">
							<div className="col-lg-12">
								<div className="main-login__header__logo">
									<a href="javascript: void(0);">
										<img
											src="resources/images/login/logo.png"
											alt="Clean UI Admin Template"
										/>
									</a>
								</div>
							</div>
						</div>
					</div>
					<div className="main-login__block main-login__block--extended pb-0">
						<div className="row">
							<div className="col-xl-12">
								<div className="main-login__block__promo text-black text-center">
									<h1 className="mb-3 text-black">
										<strong>WELCOME TO Meritocracy System</strong>
									</h1>
								</div>
								<div className="main-login__block__inner">
									<div className="main-login__block__form">
										<SignupForm />
										Already have an account?&nbsp;
										<a
											href="javascript: void(0);"
											className="utils__link--blue utils__link--underlined"
											onClick={this.goToLogin}
										>
											Click here to login
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Page>
		);
	}
}

export default SignupPage;
