import React from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function KategoriInsert() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //form data
  const [form] = Form.useForm();

  //insert data after button submitted
  const saveData = async(input) => {
    //insert data
    const { data, error } = await supabase
                              .from('kategori')
                              .insert({ nama:input.nama });

    //display message
    messageApi.success('Data berhasil disimpan', 1)
    .then(() => router.push('/kategori'));
  }

  return (
    <>
      {messageApiDisplay}

      <Button onClick={() => router.push('/kategori')} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>

      <Form
        name="book_insert"
        layout="vertical"
        onFinish={saveData}
        form={form}
      >
        <Form.Item 
          label="Nama" 
          name="nama"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
