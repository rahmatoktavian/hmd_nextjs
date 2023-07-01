import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button, Table } from 'antd';
import { EditOutlined, PlusOutlined, BookOutlined } from '@ant-design/icons';
import { supabase } from '../../../config/supabase';
import { useUser } from '@supabase/auth-helpers-react';

export default function PeminjamanIndex() {
  //route for page movemenet
  const router = useRouter();

  //get user login
  const user = useUser()

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
                              .from('peminjaman')
                              .select('id, tanggal_pinjam, petugas!inner(nama), anggota!inner(nim,nama)')
                              .eq('petugas.email', user.email);

    //looping untuk reformat data
    let result = [];
    data.map(row =>
      result.push({
        key: row.id,
        tanggal_pinjam: row.tanggal_pinjam,
        petugas_nama: row.petugas.nama,
        anggota_nim: row.anggota.nim,
        anggota_nama: row.anggota.nama
      })
    )

    //insert data table
    setDataTable(result);
  }

  //list of table column
  const tableColumn = [

    {
        title: 'Tgl. Pinjam',
        dataIndex: 'tanggal_pinjam',
        key: 'tanggal_pinjam',
        sorter: (a, b) => a.tanggal_pinjam.localeCompare(b.tanggal_pinjam),
        defaultSortOrder: 'ascend'
    },
    {
      title: 'NIM',
      dataIndex: 'anggota_nim',
      key: 'anggota_nim',
      sorter: (a, b) => a.anggota_nim.localeCompare(b.anggota_nim),
    },
    {
        title: 'Mahasiswa',
        dataIndex: 'anggota_nama',
        key: 'anggota_nama',
        sorter: (a, b) => a.anggota_nama.localeCompare(b.anggota_nama),
    },
    {
      title: 'Petugas',
      dataIndex: 'petugas_nama',
      key: 'petugas_nama',
      sorter: (a, b) => a.petugas_nama.localeCompare(b.petugas_nama),
    },
    {
      title: 'Action',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <>
            <Button type="primary" icon={<EditOutlined />} onClick={() => router.push('/app/peminjaman/update/?id='+text)} />
            <Button type="primary" icon={<BookOutlined />} onClick={() => router.push('/app/peminjaman_buku/?peminjaman_id='+text)} style={{marginLeft:10}} />
            </>,
    },
  ];

  //display data
  return (
    <>
      <Button type="primary" onClick={() => router.push('/app/peminjaman/insert')} icon={<PlusOutlined />} style={{marginBottom:10}}>Tambah</Button>
      <Table columns={tableColumn} dataSource={tableData} />
    </>
  )
}