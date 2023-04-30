import { useRouter } from 'next/router'
import { Form, Button, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function BookInsert() {
  const router = useRouter();

  return (
    <>
      <Button onClick={() => router.push('/book')} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>

      <Form
        name="book_insert"
        layout="vertical"
        onFinish={() => router.push('/book')}
       
      >
        <Form.Item label="Name">
          <Input value="" />
        </Form.Item>

        <Form.Item label="Age">
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
