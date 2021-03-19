import './style.scss';

class MyOrganisationMembersPage extends React.Component {
    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    render() {
        return (
            <div>Manage Members</div>
        );
    }
}

export default MyOrganisationMembersPage;