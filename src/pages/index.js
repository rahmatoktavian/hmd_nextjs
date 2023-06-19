import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Spin } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Index() {
  const router = useRouter();
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async() => {
    const { data:user } = await supabase.auth.getSession();
    if (user.session) {
      router.push('/app/buku')
    } else {
      router.push('/login')
    }
  }

  return (
    <Row justify="center" align="bottom">
      <Spin size="large" tip="Loading" />
    </Row>
  )
}
