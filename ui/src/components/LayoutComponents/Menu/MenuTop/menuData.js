export default [
	{
		title: 'Admin Area',
		key: 'AdminArea',
		icon: 'icmn icmn-users',
		children: [
			{
				title: 'User List',
				key: 'UserList',
				url: '/user/list',
				icon: 'icmn icmn-users',
			},
			{
				title: 'Certified Organizations',
				key: 'CertOrg',
				url: '/certorg/list',
				icon: 'icmn icmn-stack',
			},
			{
				title: 'Merit Points',
				key: 'mprange',
				url: '/mprange/list',
				icon: 'icmn icmn-stack',
			},
			{
				title: 'Evaluation',
				key: 'eval',
				url: '/eval/list',
				icon: 'icmn icmn-stack',
			},
			{
				title: 'Range Points',
				key: 'range',
				url: '/range/list',
				icon: 'icmn icmn-stack',
			},
			{
				title: 'Organization Weights',
				key: 'weight',
				url: '/weight',
				icon: 'icmn icmn-stack',
			},
			{
				title: 'Consistency Weights',
				key: 'consistency',
				url: '/consistency',
				icon: 'icmn icmn-stack',
			},
		],
	},
	{
		title: 'Users',
		key: 'Users',
		url: '/users',
		icon: 'icmn icmn-users',
	},
	{
		title: 'Organization List',
		key: 'Organization',
		url: '/client/list',
		icon: 'icmn icmn-stack',
	},
	{
		title: 'My Organizations',
		key: 'MyOrganization',
		url: '/client/mylist',
		icon: 'icmn icmn-books',
	},
];
