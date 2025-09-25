import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/login'); // 302 por defecto
}