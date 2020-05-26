import { Table, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default class EntitiesTable extends React.Component {
    state = {
        columns: [],
    }

    // рендер ячейки таблицы
    renderCell(value) {
        let backgroundColor;
        if (value < 0) {
            backgroundColor = `rgba(255, 140, 0, ${Math.abs(value)})`;
        } else if (value === 0) {
            backgroundColor = `rgb(255, 255, 255)`;
        } else {
            backgroundColor = `rgba(0, 0, 0, ${Math.abs(value)})`;
        }
        const color = (Math.abs(value) > 0.5) ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';

        return <div className="entities__table-cell" 
            style={{ backgroundColor, color }}
            >{Number(value).toFixed(4)}
        </div>
    }

    componentDidMount() {
        console.log('componentDidMount', entities)
        const { entities } = this.props;
        const columns = Object.keys(entities[0]).map(key => {
            return {
                title: key,
                dataIndex: key,
                fixed: (key === 'id') ? 'left' : false,
                render: (key !== 'id') ? this.renderCell : null,
                width: (key === 'id') ? 50 : 80,
                aggregate: 'SUM'
            }
        });
        this.setState({ columns });
    }

    // при выборе аггрегатной функции
    selectAggregate(e){
        const { col } = e.item.props;
        const { key } = e;
        const { columns } = this.state;
        // меняем значение columns[x].aggregate
        columns.find(c => c.dataIndex == col).aggregate = key;
        this.setState({ columns });
    }

    // агрегация данных по столбцам
    aggregateData(data) {
        const { columns } = this.state;
        if (!columns || columns.length == 0 ) return;

        return data.reduce((acc, n) => (Object.entries(n).forEach(([k, v]) => {
            const { aggregate } = columns.find(c => c.dataIndex == k);
            if (aggregate == 'MIN') {
                return acc[k] = ((acc[k] || 0) > v ) ? v : (acc[k] || 0);
            } 
            if (aggregate == 'MAX') {
                return acc[k] = ((acc[k] || 0) < v ) ? v : (acc[k] || 0);
            } 
            if (aggregate == 'AVG') {
                return acc[k] = ((acc[k] || 0) + v ) / 2;
            } 
            return acc[k] = (acc[k] || 0) + v;
        }), acc), {});
    }

    render() {
        const { entities } = this.props;
        const { columns } = this.state;
        // меню выбора агрегации
        const menu = (col) => {
            return <Menu onClick={this.selectAggregate.bind(this)}>
                <Menu.Item col={col} key="SUM"><span>SUM</span></Menu.Item>
                <Menu.Item col={col} key="MIN"><span>MIN</span></Menu.Item>
                <Menu.Item col={col} key="MAX"><span>MAX</span></Menu.Item>
                <Menu.Item col={col} key="AVG"><span>AVG</span></Menu.Item>
            </Menu>
        };
        
        // строка итогов
        const summary = (data) => {
            const group = this.aggregateData(data);
            if (!group) return;

            return <Table.Summary.Row>
                { Object.keys(group).map(key => {
                    if (key === 'id') {
                        return <Table.Summary.Cell key={key}>Итог</Table.Summary.Cell>;
                    }
                    const value =  Number(group[key]).toFixed(4);
                    // показываем выбранную аггрегатную функцию 
                    const { aggregate } = columns.find(c => c.dataIndex == key);
                    //console.log(aggregate);
                    return <Table.Summary.Cell key={key}>
                        <Dropdown overlay={()=>menu(key)}><span> {aggregate} <br/> { value }<DownOutlined /></span></Dropdown>
                    </Table.Summary.Cell>
                }) }
            </Table.Summary.Row>
        };        

        return (
        <div className="entities">
            <div className="entities__caption">entities</div>
            <div className="entities__table-wrap">
                {entities.length &&
                <Table 
                    columns={columns} dataSource={entities} rowKey="id"
                    className="entities__table"
                    size="small" 
                    pagination={false}
                    scroll={{ y: 300 }}
                    summary={summary}
                />
                }
            </div>

        <style jsx global>{`

        .entities {
        }
        .entities__table-wrap {
            display: flex;
            justify-content: center;
        }
        .entities__table {
            width: 900px;
        }
        @media (max-width: 1000px) {
            .entities__table {
                width: 800px;
            }
        } 
        @media (max-width: 800px) {
            .entities__table {
                width: 600px;
            }
        } 
        @media (max-width: 600px) {
            .entities__table {
                width: 400px;
            }
        } 
        @media (max-width: 400px) {
            .entities__table {
                width: 200px;
            }
        } 

        .entities__table-cell {
            padding-left: 5px;
        }

        `}</style>
            
        </div>
        )
    }
}