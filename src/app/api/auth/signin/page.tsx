'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const [mode, setMode]         = useState<'signin' | 'register'>('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      })
      if (!res.ok) {
        setError((await res.json()).error ?? 'Registration failed')
        setLoading(false)
        return
      }
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
          fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', marginBottom: '1rem',
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', margin: '0.5rem 0' }}>or</div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Brown" required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '0.9rem', pointerEvents: 'none',
                  }}>🇯🇲</span>
                  <input
                    value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="876-XXX-XXXX" type="tel"
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                  />
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 3 }}>
                  Used so buyers can contact you on listings
                </p>
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Email Address *</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              type="email" placeholder="your@email.com" required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password *</label>
            <input
              value={password} onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder={mode === 'register' ? 'Minimum 8 characters' : 'Your password'}
              required minLength={8}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

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

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  color: 'var(--muted)', textTransform: 'uppercase',
  letterSpacing: '0.06em', marginBottom: 5,
}
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--border)', borderRadius: 10,
  padding: '0.7rem 0.9rem', fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem', outline: 'none', color: 'var(--ink)',
}