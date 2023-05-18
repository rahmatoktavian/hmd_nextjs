import { useEffect, useState } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import { Button } from 'antd';

export default function Login() {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [data, setData] = useState()

  const router = useRouter();

  useEffect(() => {
  }, [user])

  if (!user) {
    return (
      <>
        <p>Login</p>
      </>
    )
  } else {
    return (
      <>
        <Button type="primary" onClick={() => router.push('/kategori')}>Kategori</Button>
      </>
    )
  }
}
