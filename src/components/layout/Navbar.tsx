'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  return (
    <>
      <nav style={{
        background: 'var(--green)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 1.5rem', height: 60,
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,.2)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '1.4rem', fontWeight: 900 }}>
            Jamaica
          </span>
          <span style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>
            Classifieds
          </span>
        </Link>

        {/* Nav links — desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavLink href="/browse">Browse</NavLink>
          {isAdmin && <NavLink href="/admin">Admin</NavLink>}

          {session ? (
            <>
              <NavLink href="/post-ad">
                <span style={{ color: 'var(--green-dark)', fontWeight: 700, background: 'var(--gold)', padding: '0.35rem 1rem', borderRadius: 8 }}>
                  + Post Ad
                </span>
              </NavLink>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
                  padding: '0.35rem 0.75rem', cursor: 'pointer', color: '#fff',
                  fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {session.user?.image
                    ? <Image src={session.user.image} alt="" width={24} height={24} style={{ borderRadius: '50%' }} />
                    : <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--green-dark)', fontWeight: 700 }}>
                        {session.user?.name?.[0] ?? 'U'}
                      </span>
                  }
                  {session.user?.name?.split(' ')[0]}
                </button>
                {menuOpen && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0, background: '#fff',
                    border: '1px solid var(--border)', borderRadius: 10, minWidth: 180,
                    boxShadow: '0 8px 24px rgba(0,0,0,.12)', overflow: 'hidden', zIndex: 200,
                  }}>
                    <DropdownLink href="/my-ads" onClick={() => setMenuOpen(false)}>My Ads</DropdownLink>
                    <DropdownLink href="/profile" onClick={() => setMenuOpen(false)}>Profile</DropdownLink>
                    {isAdmin && <DropdownLink href="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</DropdownLink>}
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                    <button onClick={() => { signOut(); setMenuOpen(false) }} style={{
                      width: '100%', background: 'none', border: 'none', textAlign: 'left',
                      padding: '0.65rem 1rem', cursor: 'pointer', fontSize: '0.875rem',
                      color: '#C0392B', fontWeight: 500,
                    }}>Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink href="/auth/signin">Sign In</NavLink>
              <Link href="/post-ad" style={{
                background: 'var(--gold)', color: 'var(--green-dark)',
                fontWeight: 700, padding: '0.4rem 1.1rem', borderRadius: 8,
                textDecoration: 'none', fontSize: '0.875rem', marginLeft: 4,
              }}>
                + Post Ad
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
      fontSize: '0.875rem', fontWeight: 500,
      padding: '0.4rem 0.75rem', borderRadius: 6,
    }}>
      {children}
    </Link>
  )
}

function DropdownLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} style={{
      display: 'block', padding: '0.65rem 1rem', fontSize: '0.875rem',
      color: 'var(--ink)', textDecoration: 'none', fontWeight: 500,
    }}>
      {children}
    </Link>
  )
}
