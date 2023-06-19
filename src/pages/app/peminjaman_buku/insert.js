import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Select, message, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../../config/supabase';

export default function PeminjamanBukuInsert() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //get id in URL (peminjaman_id)
  const peminjaman_id = router.query.peminjaman_id;

  //form data
  const [form] = Form.useForm();

  //state for kategori
  const [bukuData, setBukuData] = useState([]);
  const [disabledButtonSave, setDisabledButtonSave] = useState(false);

  useEffect(() => {
    getBuku();
  }, []);

  //get data buku
  const getBuku = async() => {
      const { data, error } = await supabase
                                .from('buku')
                                .select('id, judul')
      
      let result = [];
      data.map(row =>
        result.push({
          value: row.id,
          label: row.judul,
        })
      )
      
      //insert data state select/dropdown
      setBukuData(result);
  }

  const checkBuku = async(buku_id) => {
    const { data, error, count } = await supabase
                                .from('peminjaman_buku')
                                .select('id')
                                .eq('peminjaman_id', peminjaman_id)
                                .eq('buku_id', buku_id)
                                .single();
    if(data) {
      messageApi.error('Buku sudah ditambahkan, Pilih buku lain');
      setDisabledButtonSave(true);
    } else {
      setDisabledButtonSave(false);
    }
  };

  //insert data after button submitted
  const saveData = async(input) => {
    //insert data
    const { data, error } = await supabase
                              .from('peminjaman_buku')
                              .insert({ 
                                peminjaman_id:peminjaman_id,
                                buku_id:input.buku_id,
                              });

    //display message (return to peminjaman_buku bring peminjaman_id)
    messageApi.success('Data berhasil disimpan', 1)
    .then(() => router.push('/app/peminjaman_buku?peminjaman_id='+peminjaman_id));
  }

  return (
    <>
      {messageApiDisplay}

      <Button onClick={() => router.push('/app/peminjaman_buku?peminjaman_id='+peminjaman_id)} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>

      <Form
        name="insert"
        layout="vertical"
        onFinish={saveData}
        form={form}
      >
        <Form.Item 
          label="Buku" 
          name="buku_id"
          rules={[{ required: true }]}
        >
          <Select
            options={bukuData}
            onChange={checkBuku}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={disabledButtonSave}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}