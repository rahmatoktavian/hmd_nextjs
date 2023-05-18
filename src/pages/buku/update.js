import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Select, message, Popconfirm } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function BukuUpdate() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //get id in URL
  const id = router.query.id;

  //form data
  const [form] = Form.useForm();

  //state for kategori
  const [kategoriData, setKategoriData] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getKategori();
    getDataDetail();
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

    //insert data state select/dropdown
    setKategoriData(result);
  }

  //get choosen data
  const getDataDetail = async() => {

    //select based on id
    const { data, error } = await supabase
                              .from('buku')
                              .select('id, kategori_id, judul, stok')
                              .eq('id', id)
                              .single();
                              
    //insert data input & dropdown        
    form.setFieldsValue({ 
      kategori_id: data.kategori_id,
      judul: data.judul, 
      stok: data.stok, 
    });
  }

  //update data after button submitted
  const saveData = async(input) => {
    //update data
    const { data, error } = await supabase
                              .from('buku')
                              .update({ 
                                kategori_id:input.kategori_id,
                                judul:input.judul,
                                stok:input.stok,
                              })
                              .eq('id', id);

    //display message
    messageApi.success('Data berhasil disimpan', 1)
    .then(() => router.push('/buku'));
  }

  //delete data
  const deleteData = async() => {
    const { data, error } = await supabase
                              .from('buku')
                              .delete()
                              .eq('id', id);

    //display message
    messageApi.success('Data berhasil dihapus', 1)
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
          name="kategori_id"
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
