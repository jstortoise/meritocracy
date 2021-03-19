import './style.scss';

class MyOrganisationSettingsPage extends React.Component {
    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    render() {
        return (
            <div>My Organisations Settings</div>
        );
    }
}

export default MyOrganisationSettingsPage;