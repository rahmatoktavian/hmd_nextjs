import React, { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';
import { Pie } from '@ant-design/plots';

export default function LaporanSummary() {
  //data state
  const [data, setData] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getData();
  }, []);

  const getData = async() => {
    //calling stored procedure (rpc)
    const { data, error } = await supabase.rpc('rekap_buku');
    
    //set state chartdata
    setData(data);
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

    //change name type & value based from stored procedure (rpc)
    angleField: 'total_buku',
    colorField: 'kategori_nama',

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
