import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { Pie } from '@ant-design/plots';

export default function LaporanSummary() {
  //data state
  const [data, setData] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getData();
  }, []);

  const getData = async() => {
    //initial query
    const { data, error } = await supabase.rpc('rekap_buku');
    
    //looping untuk reformat data
    let result = [];
    data.map(row =>
      result.push({
        type: row.kategori_nama,
        value: row.total_buku,
      })
    )
    
    //set state chartdata
    setData(result);
  }

  // original chart data
  // const data = [
  //   {
  //     type: 'Science',
  //     value: 27,
  //   },
  //   {
  //     type: 'Social',
  //     value: 25,
  //   },
  //   {
  //     type: 'Language',
  //     value: 18,
  //   },
  // ];

  const config = {
    data,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
  };
  
  //display data
  return (
    <>
      <Pie {...config} />
    </>
  )
}
