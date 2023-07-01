import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Upload, Button, message } from 'antd';
import { ArrowLeftOutlined, BellOutlined, UploadOutlined } from '@ant-design/icons';
import { supabase } from '../../../config/supabase';

export default function BukuUpdate() {
  //calling message library
  const [messageApi, messageApiDisplay] = message.useMessage();
  
  //route for page movemenet
  const router = useRouter();

  //get id in URL
  const id = router.query.id;

  //state for kategori
  const [judul, setJudul] = useState('');

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
                              
    //insert data input & dropdown        
    setJudul(data.judul);
  }

  const beforeUpload = (info) => {
    const fileTypeValid = info.type === 'image/jpeg' || info.type === 'image/png';
    if (!fileTypeValid) {
      messageApi.error('You can only upload JPG/PNG file!');
    }

    return fileTypeValid;
  }

  const uploadFile = async(info) => {
    if (info.file.status !== 'uploading') {
      //file dat
      const fileUpload = info.file.originFileObj;

      //get file type (jpeg/png)
      const fileType = info.file.type.split('/');
      const fileName = Date.now()+'.'+fileType[1];

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

      <Upload 
        accept="image/png, image/jpeg"
        onChange={uploadFile}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  )
}
