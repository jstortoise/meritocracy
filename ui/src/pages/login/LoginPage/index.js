import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import LoginForm from './LoginForm';
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
class LoginPage extends React.Component {
	state = {};

	componentDidMount() {
		// document.getElementsByTagName('body')[0].style.overflow = 'hidden';
	}

	componentWillUnmount() {
		document.getElementsByTagName('body')[0].style.overflow = '';
	}

	goToSignup = () => {
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
		dispatch(push('/signup' + query));
	};

	render() {
		const { match, ...props } = this.props;
		return (
			<Page {...props}>
				<Helmet title="Login" />
				<div className="main-login">
					<div className="main-login__block main-login__block--extended pb-0">
						<div className="row">
							<div className="col-xl-12">
								<div className="main-login__block__inner">
									<div className="main-login__block__form">
										<LoginForm />
										<div className="main-login__block__no-account mb-2">
											<div>Don't have an account?</div>
											<div>
												<span
													onClick={this.goToSignup}
													style={{
														cursor: 'pointer',
														textDecoration: 'underline',
													}}
												>
													Register for free
												</span>
											</div>
										</div>
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

export default LoginPage;
