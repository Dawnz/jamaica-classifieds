'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)

    if (mode === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) { setError((await res.json()).error ?? 'Registration failed'); setLoading(false); return }
    }

    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) { setError('Invalid email or password'); return }
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,.1)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 900 }}>Jamaica </span>
            <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--green)', fontSize: '1.5rem', fontWeight: 700 }}>Classifieds</span>
          </Link>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: 6 }}>
            {mode === 'signin' ? 'Welcome back!' : 'Join thousands of Jamaicans buying and selling every day.'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: 'var(--subtle)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
          {(['signin', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }} style={{
              flex: 1, padding: '0.5rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600,
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? 'var(--green)' : 'var(--muted)',
              boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
              transition: 'all 0.15s',
            }}>
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Google */}
        <button onClick={() => signIn('google', { callbackUrl: '/' })} style={{
  width: '100%', background: '#fff', border: '1px solid var(--border)', borderRadius: 10,
  padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', marginBottom: '0.5rem',
}}>
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
  Continue with Google
</button>

<button onClick={() => signIn('linkedin', { callbackUrl: '/' })} style={{
  width: '100%', background: '#0A66C2', border: 'none', borderRadius: 10,
  padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
  color: '#fff', marginBottom: '0.5rem',
}}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
  Continue with LinkedIn
</button>

<button onClick={() => signIn('twitter', { callbackUrl: '/' })} style={{
  width: '100%', background: '#000', border: 'none', borderRadius: 10,
  padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
  color: '#fff', marginBottom: '0.5rem',
}}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
  Continue with X
</button>

<div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', margin: '0.5rem 0' }}>or</div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'register' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required
              style={inputStyle} />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address" required
            style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required
            minLength={8} style={inputStyle} />

          {error && <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 10,
            padding: '0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1.25rem' }}>
          By continuing you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Terms of Use</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--border)', borderRadius: 10,
  padding: '0.7rem 0.9rem', fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem', outline: 'none', color: 'var(--ink)',
}
