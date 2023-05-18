import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Select, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function BukuInsert() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //form data
  const [form] = Form.useForm();

  //state for kategori
  const [kategoriData, setKategoriData] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getKategori();
  }, []);

  //get data kategori
  const getKategori = async() => {
    const { data, error } = await supabase
                              .from('kategori')
                              .select('id, nama');
   
                        
    let result = [];
    data.map(row =>
      result.push({
        value: row.id,
        label: row.nama,
      })
    )
    setKategoriData(result);
  }

  //insert data after button submitted
  const saveData = async(input) => {
    //insert data
    const { data, error } = await supabase
                              .from('buku')
                              .insert({ 
                                kategori_id:input.kategori,
                                judul:input.judul,
                                stok:input.stok,
                              });

    //display message
    messageApi.success('Data berhasil disimpan', 1)
    .then(() => router.push('/buku'));
  }

  return (
    <>
      {messageApiDisplay}

      <Button onClick={() => router.push('/buku')} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>

      <Form
        name="insert"
        layout="vertical"
        onFinish={saveData}
        form={form}
      >
        <Form.Item 
          label="Kategori" 
          name="kategori"
          rules={[{ required: true }]}
        >
          <Select
            options={kategoriData}
          />
        </Form.Item>

        <Form.Item 
          label="Judul" 
          name="judul"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label="Stok" 
          name="stok"
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
