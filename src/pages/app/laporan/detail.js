import React, { useEffect, useState } from 'react';
import { Button, Form, Table, Select, Input, Spin } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { supabase } from '../../../config/supabase';

//export excel
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function LaporanDetail() {
  //form data
  const [form] = Form.useForm();

  //data state
  const [tableData, setDataTable] = useState([]);
  const [kategoriData, setKategoriData] = useState([]);
  const [loading, setLoading] = useState(true);

  //search state
  const [searchKategori, setSearchKategori] = useState('');
  const [searchJudul, setSearchJudul] = useState('');

  //initial function (first function will run in this page)
  useEffect(() => {
    getData();
    getKategori();

  //if any changes state search kategori & judul
  }, [searchKategori, searchJudul]);

  //get data using supabase API
  const getData = async() => {
    //initial query
    let query = supabase.from('buku')
                          .select('id, kategori_id, judul, stok, kategori(nama)')

    //search kategori
    if(searchKategori) {
      query = query.eq('kategori_id', searchKategori)
    }

    //search judul
    if(searchJudul) {
      query = query.ilike('judul', '%'+searchJudul+'%')
    }

    const { data, error } = await query;

    //looping untuk reformat data
    if(data) {
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

    setLoading(false)
  }

  //when search button clicked
  const searchData = (input) => {
    setSearchKategori(input.kategori_id);
    setSearchJudul(input.judul);
  }

  //get data kategori
  const getKategori = async() => {
    const { data, error } = await supabase
                              .from('kategori')
                              .select('id, nama')
                              .order('nama', {ascending:true});
    
    let result = [];
    result.push({'value':'', label:'Semua'})
    data.map(row =>
      result.push({
        value: row.id,
        label: row.nama,
      })
    )
    
    //insert data state select/dropdown
    setKategoriData(result);
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
  ];

  //export excel
  const exportExcel = () => {
    //arrange export data based on table data state
    let exportData = []
    tableData.map(row =>
      exportData.push({
        "Kategori": row.kategori_nama,
        "Judul": row.judul,
        "Stok": row.stok,
      })
    )

    //export excel setting
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    FileSaver.saveAs(data, 'book.xlsx');
  };


  //display data
  return (
    <Spin spinning={loading}>
      <Form
        name="search"
        layout="inline"
        onFinish={searchData}
        form={form}
        style={{marginBottom:10}}
      >
        <Form.Item 
          label="Kategori" 
          name="kategori_id"
        >
          <Select
            options={kategoriData}
            placeholder="Semua"
            style={{minWidth:200}}
          />
        </Form.Item>

        <Form.Item 
          label="Judul" 
          name="judul"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>

      <Table columns={tableColumn} dataSource={tableData} />

      <Button type="primary" onClick={() => exportExcel()} icon={<DownloadOutlined />} style={{backgroundColor:'green'}}> Excel</Button>
    </Spin>
  )
}
