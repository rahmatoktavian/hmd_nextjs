import { useRouter } from 'next/router'
import { Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function BookIndex() {
  const router = useRouter();

  const tableData = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: 'New York',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: 'Washington',
    },
  ];
  
  const tableColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => router.push('/book/insert')} icon={<PlusOutlined />} style={{marginBottom:20}}>Insert</Button>
      <Table columns={tableColumn} dataSource={tableData} />
    </>
  )
}
