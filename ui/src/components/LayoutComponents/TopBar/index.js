import React from 'react';
import { connect } from 'react-redux';
import ProfileMenu from './ProfileMenu';
import './style.scss';
import logo from '../../../resources/images/meritocracy_header_logo.svg';
import header from '../../../resources/images/meritocracy_header.svg';

const mapStateToProps = (state, props) => ({
	isAuthenticated: !!(state.app.userState && state.app.userState.username),
});
@connect(mapStateToProps)
class TopBar extends React.Component {
	render() {
		const { isAuthenticated } = this.props;
		return (
			<div className="topbar">
				<img src={logo} alt="Logo" />
				<img src={header} alt="Meritocracy" style={{ marginLeft: '17px' }} />
				<div className="topbar__right">{isAuthenticated && <ProfileMenu />}</div>
			</div>
		);
	}
}

export default TopBar;
