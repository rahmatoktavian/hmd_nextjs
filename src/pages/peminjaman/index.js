import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button, Table } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function BukuIndex() {
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
                              .from('peminjaman')
                              .select('id, tanggal_pinjam, petugas(nama), anggota(nim,nama)');
    console.log(error)
    //looping untuk reformat data
    let result = [];
    data.map(row =>
      result.push({
        key: row.id,
        tanggal_pinjam: row.tanggal_pinjam,
        petugas_nama: row.petugas.nama,
        anggota_nim: row.anggota.nim,
        anggota_nama: row.anggota.nama
        // kategori_nama: row.kategori.nama,
        // judul: row.judul,
        // stok: row.stok,
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
      title: 'Petugas',
      dataIndex: 'petugas_nama',
      key: 'petugas_nama',
      sorter: (a, b) => a.petugas_nama.localeCompare(b.petugas_nama),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'NIM',
      dataIndex: 'anggota_nim',
      key: 'anggota_nim',
      sorter: (a, b) => a.anggota_nim.localeCompare(b.anggota_nim),
      defaultSortOrder: 'ascend'
    },


    {
        title: 'Mahasiswa',
        dataIndex: 'anggota_nama',
        key: 'anggota_nama',
        sorter: (a, b) => a.anggota_nama.localeCompare(b.anggota_nama),
        defaultSortOrder: 'ascend'
    },

    // {
    //   title: 'Stok',
    //   dataIndex: 'stok',
    //   key: 'stok',
    //   sorter: (a, b) => a.stok - b.stok,
    //   defaultSortOrder: 'ascend'
    // },
    {
      title: 'Action',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <Button type="primary" icon={<EditOutlined />} onClick={() => router.push('/peminjaman/update/?id='+text)} />,
    },
  ];

  //display data
  return (
    <>
      <Button type="primary" onClick={() => router.push('/peminjaman/insert')} icon={<PlusOutlined />} style={{marginBottom:10}}>Tambah</Button>
      <Table columns={tableColumn} dataSource={tableData} />
    </>
  )
}