'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PARISHES } from '@/types'

type User = {
  id: string; name: string | null; email: string; phone: string | null
  parish: string | null; image: string | null; bio: string | null
  createdAt: Date; hasPassword: boolean
}
type Listing = {
  id: string; title: string; priceLabel: string | null; parish: string
  tier: string; createdAt: Date; viewCount: number
  category: { name: string; icon: string | null }
  images: { url: string }[]
}

export default function ProfileClient({ user, listings }: { user: User; listings: Listing[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name:   user.name   ?? '',
    phone:  user.phone  ?? '',
    parish: user.parish ?? '',
    bio:    user.bio    ?? '',
    image:  user.image  ?? '',
  })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'listings'>('profile')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) { const { url } = await res.json(); setForm(f => ({ ...f, image: url })) }
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true); setError(''); setSuccess('')
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        ...(activeTab === 'password' ? { currentPassword, newPassword } : {}),
      }),
    })
    setSaving(false)
    if (!res.ok) { setError((await res.json()).error ?? 'Failed to save'); return }
    setSuccess(activeTab === 'password' ? 'Password updated!' : 'Profile saved!')
    if (activeTab === 'password') { setCurrentPassword(''); setNewPassword('') }
    router.refresh()
    setTimeout(() => setSuccess(''), 3000)
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-JM', { month: 'long', year: 'numeric' })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', background: '#E8F5ED', margin: '0 auto', position: 'relative', border: '3px solid #1A7A3C' }}>
              {form.image
                ? <Image src={form.image} alt="" fill style={{ objectFit: 'cover' }} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2.5rem', fontWeight: 700, color: '#1A7A3C' }}>
                    {user.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
              }
            </div>
            <button onClick={() => fileRef.current?.click()} style={{
              position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%',
              background: '#1A7A3C', border: '2px solid #fff', color: '#fff',
              fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {uploading ? '…' : '✏️'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{user.name ?? 'Your Name'}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: 4 }}>{user.email}</div>
          {user.parish && <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: 4 }}>📍 {user.parish}</div>}
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Member since {memberSince}</div>
          {user.bio && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5, textAlign: 'left', background: '#F4F4F2', borderRadius: 8, padding: '0.65rem' }}>
              {user.bio}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 14, padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Active Ads',   value: listings.length },
              { label: 'Total Views',  value: listings.reduce((s, l) => s + l.viewCount, 0) },
            ].map(s => (
              <div key={s.label} style={{ background: '#F4F4F2', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A7A3C' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', background: '#fff', border: '1px solid #E5E5E0', borderRadius: 10, padding: 4 }}>
          {[
            { key: 'profile',  label: '👤 Profile' },
            { key: 'password', label: '🔒 Password' },
            { key: 'listings', label: `📋 My Listings (${listings.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
              flex: 1, padding: '0.5rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600,
              background: activeTab === tab.key ? '#1A7A3C' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#6B7280',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Edit Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Email</label>
                  <input value={user.email} disabled style={{ ...inp, background: '#F4F4F2', color: '#9CA3AF' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Phone</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🇯🇲</span>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="876-XXX-XXXX" style={{ ...inp, paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Parish</label>
                  <select value={form.parish} onChange={e => setForm(f => ({ ...f, parish: e.target.value }))} style={inp}>
                    <option value="">Select parish</option>
                    {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell buyers a bit about yourself..." rows={3} style={{ ...inp, width: '100%', resize: 'vertical' }} />
              </div>
            </div>
            {error   && <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '0.65rem', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</div>}
            {success && <div style={{ background: '#D1FAE5', color: '#065F46', borderRadius: 8, padding: '0.65rem', fontSize: '0.85rem', marginTop: '1rem' }}>{success}</div>}
            <button onClick={handleSave} disabled={saving} style={saveBtn}>{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        )}

        {activeTab === 'password' && (
          <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Change Password</h2>
            {!user.hasPassword ? (
              <div style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 8, padding: '1rem', fontSize: '0.875rem' }}>
                Your account uses social login (Google/LinkedIn/X). Password login is not available.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
                <div>
                  <label style={lbl}>Current Password *</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>New Password *</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" style={inp} />
                </div>
                {error   && <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '0.65rem', fontSize: '0.85rem' }}>{error}</div>}
                {success && <div style={{ background: '#D1FAE5', color: '#065F46', borderRadius: 8, padding: '0.65rem', fontSize: '0.85rem' }}>{success}</div>}
                <button onClick={handleSave} disabled={saving} style={saveBtn}>{saving ? 'Updating…' : 'Update Password'}</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Active Listings</h2>
              <Link href="/post-ad" style={{ background: '#1A7A3C', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>+ Post New Ad</Link>
            </div>
            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12, border: '1px solid #E5E5E0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
                <p style={{ color: '#6B7280', marginBottom: '1rem' }}>No active listings</p>
                <Link href="/post-ad" style={{ background: '#1A7A3C', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>Post a Free Ad</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {listings.map(l => (
                  <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: '#fff', border: l.tier === 'PREMIUM' ? '1.5px solid #F7C948' : '1px solid #E5E5E0', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ height: 140, background: '#F4F4F2', position: 'relative' }}>
                        {l.images[0]?.url
                          ? <Image src={l.images[0].url} alt={l.title} fill style={{ objectFit: 'cover' }} sizes="220px" />
                          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem' }}>{l.category.icon}</div>
                        }
                        {l.tier === 'PREMIUM' && (
                          <span style={{ position: 'absolute', top: 8, left: 8, background: '#F7C948', color: '#7B3F00', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⭐ Featured</span>
                        )}
                      </div>
                      <div style={{ padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.72rem', color: '#1A7A3C', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{l.category.icon} {l.category.name}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1D2124', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A7A3C', marginBottom: 4 }}>{l.priceLabel ?? 'Contact for price'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
                          <span>📍 {l.parish}</span>
                          <span>👁️ {l.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/my-ads" style={{ color: '#1A7A3C', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>View all ads including expired →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }
const inp: React.CSSProperties = { width: '100%', border: '1px solid #E5E5E0', borderRadius: 8, padding: '0.65rem 0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', outline: 'none', color: '#1D2124' }
const saveBtn: React.CSSProperties = { marginTop: '1.25rem', background: '#1A7A3C', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }