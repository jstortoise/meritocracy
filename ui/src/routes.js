import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedSwitch } from 'reactRouterConnected';
import Loadable from 'react-loadable';
import Page from 'components/LayoutComponents/Page';
import NotFoundPage from 'pages/NotFoundPage';
import HomePage from 'pages/HomePage';

const loadable = loader =>
	Loadable({
		loader,
		delay: false,
		loading: () => null,
	});

const loadableRoutes = {
	// Default Pages
	'/signup': {
		component: loadable(() => import('pages/login/SignupPage')),
	},
	'/login': {
		component: loadable(() => import('pages/login/LoginPage')),
	},
	'/empty': {
		component: loadable(() => import('pages/EmptyPage')),
	},
	'/client/list': {
		component: loadable(() => import('pages/client/ClientListPage')),
	},
	'/client/mylist': {
		component: loadable(() => import('pages/client/MyClientListPage')),
	},
	'/client/add': {
		component: loadable(() => import('pages/client/ClientAddPage')),
	},
	'/client/detail/:clientId': {
		component: loadable(() => import('pages/client/ClientDetailPage')),
	},
	'/client/comment/:clientId': {
		component: loadable(() => import('pages/client/CommentPage')),
	},
	'/client/mylist/detail/:clientId': {
		component: loadable(() => import('pages/client/MyClientDetailPage')),
	},
	'/certorg/list': {
		component: loadable(() => import('pages/admin/certorg/ListPage')),
	},
	'/certorg/add': {
		component: loadable(() => import('pages/admin/certorg/AddPage')),
	},
	'/certorg/detail/:clientId/': {
		component: loadable(() => import('pages/admin/certorg/DetailPage')),
	},
	'/user/list': {
		component: loadable(() => import('pages/admin/user/ListPage')),
	},
	'/user/add': {
		component: loadable(() => import('pages/admin/user/AddPage')),
	},
	'/user/edit/:_id': {
		component: loadable(() => import('pages/admin/user/EditPage')),
	},
	'/user/detail/:_id': {
		component: loadable(() => import('pages/admin/user/DetailPage')),
	},
	'/users/detail/:username': {
		component: loadable(() => import('pages/user/DetailPage')),
	},
	'/users/detail/:username/score/:clientId': {
		component: loadable(() => import('pages/user/ScorePage')),
	},
	'/users': {
		component: loadable(() => import('pages/user/ListPage')),
	},
	'/profile': {
		component: loadable(() => import('pages/user/ProfilePage')),
	},
	'/mprange/list': {
		component: loadable(() => import('pages/admin/mprange/ListPage')),
	},
	'/mprange/edit/:type': {
		component: loadable(() => import('pages/admin/mprange/EditPage')),
	},
	'/eval/list': {
		component: loadable(() => import('pages/admin/eval/ListPage')),
	},
	'/eval/edit/:type': {
		component: loadable(() => import('pages/admin/eval/EditPage')),
	},
	'/range/list': {
		component: loadable(() => import('pages/admin/range/ListPage')),
	},
	'/range/add': {
		component: loadable(() => import('pages/admin/range/AddPage')),
	},
	'/range/detail/:type': {
		component: loadable(() => import('pages/admin/range/DetailPage')),
	},
	'/range/edit/:type': {
		component: loadable(() => import('pages/admin/range/EditPage')),
	},
	'/weight': {
		component: loadable(() => import('pages/admin/weight/EditPage')),
	},
	'/consistency': {
		component: loadable(() => import('pages/admin/consistency/EditPage')),
	},
};

class Routes extends React.Component {
	timeoutId = null;

	componentDidMount() {
		this.timeoutId = setTimeout(
			() =>
				Object.keys(loadableRoutes).forEach(path =>
					loadableRoutes[path].component.preload(),
				),
			5000, // load after 5 sec
		);
	}

	componentWillUnmount() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
	}

	render() {
		return (
			<ConnectedSwitch>
				<Route exact path="/" component={HomePage} />
				{Object.keys(loadableRoutes).map(path => {
					const { exact, ...props } = loadableRoutes[path];
					props.exact = exact === void 0 || exact || false; // set true as default
					return <Route key={path} path={path} {...props} />;
				})}
				<Route
					render={() => (
						<Page>
							<NotFoundPage />
						</Page>
					)}
				/>
			</ConnectedSwitch>
		);
	}
}

export { loadableRoutes };
export default Routes;
