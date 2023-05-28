import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Select, message, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function PeminjamanInsert() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //form data
  const [form] = Form.useForm();

  //state for kategori
  const [PetugasData, setPetugasData] = useState([]);
  const [AnggotaData, setAnggotaData] = useState([]);

  useEffect(() => {
    getPetugas();
    getAnggota();
  }, []);

  //get data petugas
  const getPetugas = async() => {
      const { data, error } = await supabase
                                .from('petugas')
                                .select('id, nama');
      console.log(data)      
      let result = [];
      data.map(row =>
        result.push({
          value: row.id,
          label: row.nama,
        })
      )
      
      //insert data state select/dropdown
      setPetugasData(result);
    }
    
  //get data petugas
  const getAnggota = async() => {
    const { data, error } = await supabase
                              .from('anggota')
                              .select('id, nim, nama');
    console.log(data)      
    let result = [];
    data.map(row =>
      result.push({
        value: row.id,
        label: row.nama,
      })
    )
    
    //insert data state select/dropdown
    setAnggotaData(result);
  }

  //insert data after button submitted
  const saveData = async(input) => {
    //insert data
    const { data, error } = await supabase
                              .from('peminjaman')
                              .insert({ 
                                peminjaman_id:input.peminjaman_id,
                                petugas_id:input.petugas_id,
                                anggota_id:input.anggota_id,
                                tanggal_pinjam:input.tgl_pinjam,
                              });

    

    //display message
    messageApi.success('Data berhasil disimpan', 1)
    .then(() => router.push('/peminjaman'));
  }

  return (
    <>
      {messageApiDisplay}

      <Button onClick={() => router.push('/peminjaman')} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>

      <Form
        name="insert"
        layout="vertical"
        onFinish={saveData}
        form={form}
      >
        <Form.Item 
          label="Petugas" 
          name="petugas_id"
          rules={[{ required: true }]}
        >
          <Select
            options={PetugasData}
          />
        </Form.Item>

        <Form.Item 
          label="Anggota" 
          name="anggota_id"
          rules={[{ required: true }]}
        >
          <Select
            options={AnggotaData}
          />
        </Form.Item>

        <Form.Item 
          label="Tgl. Pinjam" 
          name="tgl_pinjam"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>

        {/* <Form.Item 
          label="Stok" 
          name="stok"
          rules={[{ required: true }]}
        >
          <Input />

          
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}