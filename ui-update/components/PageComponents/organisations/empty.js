import Link from 'next/link';
import { Card, Typography, Icon } from 'antd';
import './style.scss';

const { Paragraph, Text } = Typography;

class EmptyPanel extends React.Component {
    render() {
        return (
            <Card
                title="MY CREATED ORGANISATIONS"
                className="organisation-empty-panel"
                extra={<Icon type="star"/>}
            >
                <Paragraph className="img-paragraph"><img src="/static/images/share.png"/></Paragraph>
                <Paragraph><Text type="secondary">You have not created an Organisation yet</Text></Paragraph>
                <Paragraph><Text>Create an Organisation</Text></Paragraph>
                <Paragraph className="img-paragraph">
                    <Link href="/organisations/create">
                        <a><img src="/static/images/org_add.png" /></a>
                    </Link>
                </Paragraph>
            </Card>
        );
    };
}

export default EmptyPanel;