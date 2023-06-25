import React from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Form, Button, Input, message } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Signin() {
  //supabase auth
  const supabase = createClientComponentClient()

  //route for page movemenet
  const router = useRouter();

  //form data
  const [form] = Form.useForm();

  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();

  //login process
  const onSubmit = async(input) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    //display message
    if(error) {
      messageApi.error(error.message, 1);
    } else {
      messageApi.success('Berhasil Login', 1);
      router.push('/app/buku')
    }
  }

  return (
    <Row>
      {messageApiDisplay}

      <Col span={9}></Col>
      <Col span={6}>
        <Form
          name="signin"
          layout="vertical"
          onFinish={onSubmit}
          form={form}
          
        >
          <Form.Item 
            label="Email" 
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Password" 
            name="password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" block onClick={() => router.push('signup')}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={9}></Col>

    </Row>
  )
}
