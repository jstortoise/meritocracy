import { Card, Result, Icon } from 'antd';

const EmptyResult = props => (
    <Card style={{ marginBottom: '10px' }}>
        <Result icon={<Icon type="frown" theme="outlined" />} extra={[
            <p key="1">We couldn't find anything for</p>,
            <p key="2"><b>{props.keyword}</b></p>,
            <p key="3">Try searching for other keywords</p>
        ]} />
    </Card>
);

export default EmptyResult;