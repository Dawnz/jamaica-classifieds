'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  return (
    <>
      <nav style={{
        background: 'var(--green)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 1.25rem', height: 60,
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,.2)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '1.4rem', fontWeight: 900 }}>Jamaica</span>
          <span style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Classifieds</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links-desktop" style={{ alignItems: 'center', gap: 4 }}>
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
                  fontFamily: 'var(--font-sans)',
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
                      color: '#C0392B', fontWeight: 500, fontFamily: 'var(--font-sans)',
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
              }}>+ Post Ad</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: '1.5rem', padding: '0.25rem',
            display: 'none', alignItems: 'center',
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <MobileLink href="/browse"      onClick={() => setMobileOpen(false)}>🔍 Browse Listings</MobileLink>
        {session ? (
          <>
            <MobileLink href="/post-ad"  onClick={() => setMobileOpen(false)}>✏️ Post an Ad</MobileLink>
            <MobileLink href="/my-ads"   onClick={() => setMobileOpen(false)}>📋 My Ads</MobileLink>
            {isAdmin && <MobileLink href="/admin" onClick={() => setMobileOpen(false)}>⚙️ Admin Panel</MobileLink>}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 4, paddingTop: 4 }}>
              <button onClick={() => { signOut(); setMobileOpen(false) }} style={{
                width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: 8, padding: '0.65rem 1rem', cursor: 'pointer',
                color: '#fff', fontSize: '0.9rem', fontFamily: 'var(--font-sans)',
                textAlign: 'left', fontWeight: 500,
              }}>🚪 Sign Out</button>
            </div>
          </>
        ) : (
          <>
            <MobileLink href="/auth/signin" onClick={() => setMobileOpen(false)}>👤 Sign In</MobileLink>
            <MobileLink href="/post-ad"     onClick={() => setMobileOpen(false)}>✏️ Post a Free Ad</MobileLink>
          </>
        )}
      </div>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, padding: '0.4rem 0.75rem', borderRadius: 6 }}>
      {children}
    </Link>
  )
}

function DropdownLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} style={{ display: 'block', padding: '0.65rem 1rem', fontSize: '0.875rem', color: 'var(--ink)', textDecoration: 'none', fontWeight: 500 }}>
      {children}
    </Link>
  )
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} style={{
      display: 'block', padding: '0.65rem 1rem', fontSize: '0.9rem',
      color: '#fff', textDecoration: 'none', fontWeight: 500,
      background: 'rgba(255,255,255,0.1)', borderRadius: 8,
    }}>
      {children}
    </Link>
  )
}
