import { useRouter } from 'next/router';
import { Button } from 'antd';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Button type="primary" onClick={() => router.push('/book')}>Go to Book</Button>
    </>
  )
}
