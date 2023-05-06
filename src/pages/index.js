import { useRouter } from 'next/router';
import { Button } from 'antd';

export default function Login() {
  const router = useRouter();
  return (
    <>
      <Button type="primary" onClick={() => router.push('/kategori')}>Kategori</Button>
    </>
  )
}
