import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button, List, Table, Popconfirm } from 'antd';
import { ArrowLeftOutlined, UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '../../config/supabase';

export default function PeminjamanBukuIndex() {
  //route for page movemenet
  const router = useRouter();

  //get id in URL (peminjaman_id)
  const peminjaman_id = router.query.peminjaman_id;

  //state [stateName, function to change state data]
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [tableData, setDataTable] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getDetailPeminjaman();
    getDataPeminjamanBuku();
  }, []);

  //get detail peminjaman (header)
  const getDetailPeminjaman = async() => {
    const { data, error } = await supabase
                              .from('peminjaman')
                              .select('id, tanggal_pinjam, petugas(nama), anggota(nim,nama)')
                              .eq('id', peminjaman_id)

    //insert data header
    setPeminjamanData(data);
  }

  //get data peminjaman buku (table)
  const getDataPeminjamanBuku = async() => {
    const { data, error } = await supabase
                              .from('peminjaman_buku')
                              .select('id, buku(judul)')
                              .eq('peminjaman_id', peminjaman_id);

    //looping untuk reformat data
    let result = [];
    data.map(row =>
      result.push({
        key: row.id,
        judul: row.buku.judul,
      })
    )

    //insert data table
    setDataTable(result);
  }

  //list of table column
  const tableColumn = [

    {
        title: 'Judul Buku',
        dataIndex: 'judul',
        key: 'judul',
        sorter: (a, b) => a.judul.localeCompare(b.judul),
        defaultSortOrder: 'ascend'
    },
    {
      title: 'Action',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <Popconfirm
                            title="Hapus data"
                            description="Apakah anda yakin?"
                            onConfirm={() => deleteData(text)}
                        >
                          <Button type="primary" icon={<DeleteOutlined />}  />
                        </Popconfirm>,
    },
  ];

  const deleteData = async(id) => {
    alert(id)
  }

  //display data
  return (
    <>
      <Button onClick={() => router.push('/peminjaman')} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>

      <List
        itemLayout="horizontal"
        dataSource={peminjamanData}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined style={{fontSize:30}} />}
              title={item.anggota.nama+' (NIM: '+item.anggota.nim+')'}
              description={'Tgl Pinjam: '+item.tanggal_pinjam}
              style={{marginLeft:20}}
            />
          </List.Item>
        )}
      />

      <Button type="primary" onClick={() => router.push('/peminjaman_buku/insert/?peminjaman_id='+peminjaman_id)} icon={<PlusOutlined />} style={{marginBottom:10, marginTop:10}}>Tambah Buku</Button>

      <Table columns={tableColumn} dataSource={tableData} />
    </>
  )
}