import React, { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function LaporanSummary() {
  //data state
  const [options, setOption] = useState ({});
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  //initial function (first function will run in this page)
  useEffect(() => {
    getData();
  }, []);

  const getData = async() => {
    //calling stored procedure (rpc)
    const { data, error } = await supabase.rpc('rekap_buku');
    
    if(data) {
      //loop data to fill state
      let seriesData = [];
      let labelsData = [];
      data.map(row => {
        seriesData.push(row.total_buku)
        labelsData.push(row.kategori_nama)
      })
      
      //set state chartdata
      setSeries(seriesData);
      setOption({ labels: labelsData });
    }
  }

  //display data
  return (
    <>
      <Chart
          options={options}
          series={series}
          type="pie"
          width="500"
        />
    </>
  )
}
