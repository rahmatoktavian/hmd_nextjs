import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, message, Popconfirm } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function KategoriUpdate() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //state for input text
  const [inputData, setInputData] = useState([]);

  //route for page movemenet
  const router = useRouter();

  //get id in URL
  const id = router.query.id;

  //form data
  const [form] = Form.useForm();
  
  //initial function (first function will run in this page)
  useEffect(() => {
    getDataDetail();
  }, []);

  //get choosen data
  const getDataDetail = async() => {

    //select based on id
    const { data, error } = await supabase
                              .from('kategori')
                              .select('id, nama')
                              .eq('id', id)
                              .single();
                      
    form.setFieldsValue({ 
      nama: data.nama 
    });
  }

  //update data after button submitted
  const saveData = async(input) => {
    //update data
    const { data, error } = await supabase
                              .from('kategori')
                              .update({ nama:input.nama })
                              .eq('id', id);

    //display message
    messageApi.success('Data berhasil disimpan', 1)
    .then(() => router.push('/kategori'));
  }

  //delete data
  const deleteData = async() => {
    const { data, error } = await supabase
                              .from('kategori')
                              .delete()
                              .eq('id', id);

    //display message
    messageApi.success('Data berhasil dihapus', 1)
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
          <Popconfirm
            title="Hapus data"
            description="Apakah anda yakin?"
            onConfirm={deleteData}
          >
            <Button type="link">
              Delete
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </>
  )
}
