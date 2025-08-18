import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Planet Pulse Labs</h1>
      <Link href="/dashboard">
        <a style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: '#4f46e5',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none'
        }}>
          Go to Dashboard
        </a>
      </Link>
    </div>
  );
}
