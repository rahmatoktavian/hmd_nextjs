import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button, Table } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function BookIndex() {
  const router = useRouter();

  //state [stateName, function to change state data]
  const [tableData, setDataTable] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getData();
  });

  //get data using supabase API
  const getData = async() => {
    const { data, error } = await supabase
                              .from('kategori')
                              .select('id, nama');
    setDataTable(data);
  }

  //get data using manual fetch process
  const getDataManual = async() => {
    fetch("https://cdjndiwlkguoekmsamkv.supabase.co/rest/v1/kategori?select=id,nama", {
      method: 'get',
      headers: new Headers({
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkam5kaXdsa2d1b2VrbXNhbWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTczNjI1NTIsImV4cCI6MTk3MjkzODU1Mn0.fZzlfdwRpKp5e3nkw-8FrmSGYJyejnz5Dlh_21o-MW4', 
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkam5kaXdsa2d1b2VrbXNhbWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTczNjI1NTIsImV4cCI6MTk3MjkzODU1Mn0.fZzlfdwRpKp5e3nkw-8FrmSGYJyejnz5Dlh_21o-MW4'
      }), 
    })
    .then(res => res.json())
    .then((data) => {
        setDataTable(data);
    })
  }

  //list of table column
  const tableColumn = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
      render: (text) => <Button type="primary" icon={<EditOutlined />}>{text}</Button>,
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      defaultSortOrder: 'ascend'
    },
    // {
    //   title: 'Stok',
    //   dataIndex: 'stok',
    //   key: 'stok',
    //   sorter: (a, b) => a.stok - b.stok,
    // },
  ];

  //display data
  return (
    <>
      <Button type="primary" onClick={() => router.push('/kategori/insert')} icon={<PlusOutlined />} style={{marginBottom:10}}>Tambah</Button>
      <Table columns={tableColumn} dataSource={tableData} />
    </>
  )
}
