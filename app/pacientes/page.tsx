import Link from 'next/link';

export default function Home() {
  return (
    <div style={{minHeight:'70vh',display:'grid',placeItems:'center', background: '#000'}}>
      <Link
        href="/pacientes/registrar"
        style={{
          padding:'1px 1px', border:'1px solid rgba(204, 204, 204, 1)',
          borderRadius:12, fontWeight:600, textDecoration:'none', 
          color: 'rgba(204, 204, 204, 1)'
        }}
      >
        ➕ Registrar paciente
      </Link>
    </div>
  );
}
