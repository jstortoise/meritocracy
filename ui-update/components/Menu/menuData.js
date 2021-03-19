export default [{
    title: 'DASHBOARD',
    key: 'dashboard',
    url: '/dashboard',
    image: 'dashboard.png'
}, {
    divider: true
}, {
    title: 'ORGANISATIONS',
    key: 'organisations',
    url: '/organisations',
    image: 'bookmark.png'
}, {
    divider: true
}, {
    title: 'MY ORGANISATIONS',
    key: 'my-organisations',
    image: 'briefcase.png',
    subMenu: [{
        title: 'Organisations Settings',
        key: 'organisations-settings',
        url: '/organisations/me/settings',
    }, {
        title: 'Manage Members',
        key: 'manage-members',
        url: '/organisations/me/members'
    }, {
        title: 'My Created Organisations',
        key: 'my-created-organisations',
        url: '/organisations/me'
    }]
}, {
    divider: true
}, {
    title: 'MANAGE ACCOUNT',
    key: 'manage-account',
    url: '/admin/settings',
    icon: 'setting'
}, {
    divider: true
}, {
    title: 'ACCOUNT HISTORY',
    key: 'account-history',
    icon: 'check-circle'
}, {
    divider: true
}, {
    title: 'GLOBAL MEMBERS',
    key: 'global-members',
    icon: 'global',
    url: '/members'
}, {
    divider: true
}, {
    title: 'RATINGS',
    key: 'ratings',
    icon: 'star',
    // image: 'rating.png',
}, {
    divider: true
}, {
    title: 'BLOCKCHAIN',
    key: 'blockchain',
    icon: 'dollar',
    url: '/blockchain'
}];
