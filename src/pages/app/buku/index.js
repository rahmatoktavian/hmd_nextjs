import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button, Table } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
// import { supabase } from '../../../config/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function BukuIndex() {
  //supabase
  const supabase = createClientComponentClient()
  
  //route for page movemenet
  const router = useRouter();

  //state [stateName, function to change state data]
  const [tableData, setDataTable] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getData();
  }, []);

  //get data using supabase API
  const getData = async() => {
    //kategori(nama) : join kategori then select kategori.nama
    const { data, error } = await supabase
                              .from('buku')
                              .select('id, judul, stok, kategori(nama)');
    
    //looping untuk reformat data
    let result = [];
    data.map(row =>
      result.push({
        key: row.id,
        kategori_nama: row.kategori.nama,
        judul: row.judul,
        stok: row.stok,
      })
    )

    //insert data table
    setDataTable(result);
  }

  //list of table column
  const tableColumn = [
    {
      title: 'Kategori',
      dataIndex: 'kategori_nama',
      key: 'kategori_nama',
      sorter: (a, b) => a.kategori_nama.localeCompare(b.kategori_nama),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Judul',
      dataIndex: 'judul',
      key: 'judul',
      sorter: (a, b) => a.judul.localeCompare(b.judul),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Stok',
      dataIndex: 'stok',
      key: 'stok',
      sorter: (a, b) => a.stok - b.stok,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Action',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <Button type="primary" icon={<EditOutlined />} onClick={() => router.push('/app/buku/update/?id='+text)} />,
    },
  ];

  //display data
  return (
    <>
      <Button type="primary" onClick={() => router.push('/app/buku/insert')} icon={<PlusOutlined />} style={{marginBottom:10}}>Tambah</Button>
      <Table columns={tableColumn} dataSource={tableData} />
    </>
  )
}
