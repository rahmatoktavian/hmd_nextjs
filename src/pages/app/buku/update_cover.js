import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Upload, Button, message, Typography } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { supabase } from '../../../config/supabase';
import Title from 'antd/es/skeleton/Title';

export default function BukuUpdate() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //get id in URL
  const id = router.query.id;

  //state for kategori
  const [judul, setJudul] = useState('');

  //text
  const { Title } = Typography;

  //initial function (first function will run in this page)
  useEffect(() => {
    getDataDetail();
  }, []);

  //get choosen data
  const getDataDetail = async() => {
    
    //select based on id
    const { data, error } = await supabase
                              .from('buku')
                              .select('judul')
                              .eq('id', id)
                              .single();
                              
    setJudul(data.judul);
  }

  const uploadFile = async(info) => {
    if (info.file.status !== 'uploading') {
      //file data
      const fileUpload = info.file.originFileObj;

      //rename file name using timestamp + extension
      const fileExt = info.file.type.split('/');
      const fileName = Date.now()+'.'+fileExt[1];

      //file path
      const filePath = 'buku/'+fileName;

      //upload file
      const { data, error } = await supabase
                              .storage
                              .from('hmd')
                              .upload(filePath, fileUpload, {
                                cacheControl: '3600',
                                upsert: false
                              });

      //if any upload error
      if (error) {
        messageApi.error(error.message);

      //if upload succeed
      } else {
        //get file URL
        const { data:fileURL } = supabase
                          .storage
                          .from('hmd')
                          .getPublicUrl(filePath);

        //update file URL into table
        const { data, error } = await supabase
                          .from('buku')
                          .update({ 
                            cover:fileURL.publicUrl,
                          })
                          .eq('id', id);
              
        messageApi.success('uploaded successfully');
        router.push('/app/buku')
      }
    }
  }
  
  return (
    <>
      {messageApiDisplay}

      <Button onClick={() => router.push('/app/buku')} icon={<ArrowLeftOutlined />} style={{marginBottom:20}}>Back</Button>
      <br />

      <Title level={3}>{judul}</Title>
      <br />

      <Upload 
        accept="image/png, image/jpeg"
        onChange={uploadFile}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  )
}
