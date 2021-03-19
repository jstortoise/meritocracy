import { Row, Col, Pagination, Button, Icon } from 'antd';
import './style.scss';

class PaginationComponent extends React.Component {
    onFirst = () => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(1);
        }
    };
    
    onLast = () => {
        const { onChange, current, total } = this.props;
        const pageSize = this.props.pageSize || 10;
        const page_count = Math.ceil(total / pageSize);
        if (onChange) {
            onChange(page_count);
        }
    };
    
    render() {
        const { current, total, size } = this.props;
        const pageSize = this.props.pageSize || 10;
        const page_count = Math.ceil(total / pageSize);

        return (
            <Row type="flex" gutter={8} className={`pagination ${size}`}>
                <Col><Button onClick={this.onFirst} disabled={current == 1}><Icon type="double-left"/></Button></Col>
                <Col>
                    <Pagination {...this.props} />
                </Col>
                <Col>
                    <Button onClick={this.onLast} disabled={current >= page_count}>
                        <Icon type="double-right"/>
                    </Button>
                </Col>
            </Row>
        )
    }
}

export default PaginationComponent;