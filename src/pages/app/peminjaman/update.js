import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Select, message, Popconfirm, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../../config/supabase';
import dayjs from 'dayjs';

export default function PeminjamanUpdate() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //get id in URL
  const id = router.query.id;

  //form data
  const [form] = Form.useForm();

  //state for kategori
  const [PetugasData, setPetugasData] = useState([]);
  const [AnggotaData, setAnggotaData] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getPetugas();
    getAnggota();
    getDataDetail();
  }, []);

  //get data kategori
  const getPetugas = async() => {
    const { data, error } = await supabase
                              .from('petugas')
                              .select('id, nama');
   
                        
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

  const getAnggota = async() => {
    const { data, error } = await supabase
                              .from('anggota')
                              .select('id, nama');
   
                        
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

  //get choosen data
  const getDataDetail = async() => {

    //select based on id
    const { data, error } = await supabase
                              .from('peminjaman')
                              .select('id, petugas_id, anggota_id, tanggal_pinjam')
                              .eq('id', id)
                              .single();
                              
    //insert data input & dropdown        
    form.setFieldsValue({ 
      peminjaman_id: data.peminjaman_id,
      petugas_id: data.petugas_id,
      anggota_id: data.anggota_id,
      tgl_pinjam: dayjs(data.tanggal_pinjam),
    });
  }

  //update data after button submitted
  const saveData = async(input) => {
    //update data
    const { data, error } = await supabase
                              .from('peminjaman')
                              .update({ 
                                peminjaman_id:input.peminjaman_id,
                                petugas_id:input.petugas_id,
                                anggota_id:input.anggota_id,
                                tanggal_pinjam:input.tgl_pinjam.format('YYYY-MM-DD'),
                              })
                              .eq('id', id);

    //display message
    messageApi.success('Data berhasil disimpan', 1)
    .then(() => router.push('/app/peminjaman'));
  }

  //delete data
  const deleteData = async() => {
    const { data, error } = await supabase
                              .from('peminjaman')
                              .delete()
                              .eq('id', id);

    //display message
    messageApi.success('Data berhasil dihapus', 1)
    .then(() => router.push('/app/peminjaman'));
  }

  return (
    <>
      {messageApiDisplay}

      <Button onClick={() => router.push('/app/peminjaman')} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>

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
          <DatePicker/>
        
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