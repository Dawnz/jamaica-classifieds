'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PARISHES, CATEGORY_FILTERS } from '@/types'

type Category = { id: string; name: string; slug: string; icon: string | null; subCategories: { id: string; name: string }[] }

export default function PostAdPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '', description: '', price: '', priceLabel: '',
    parish: '', categoryId: '', subCategoryId: '',
    contactName: '', contactPhone: '', contactEmail: '',
    tier: 'FREE',
  })
  const [fields, setFields] = useState<{ key: string; label: string; value: string }[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  const selectedCategory = categories.find(c => c.id === form.categoryId)
  const dynamicFilters = CATEGORY_FILTERS[selectedCategory?.slug ?? ''] ?? []

  function handleCategoryChange(categoryId: string) {
    setForm(f => ({ ...f, categoryId, subCategoryId: '' }))
    const cat = categories.find(c => c.id === categoryId)
    const filters = CATEGORY_FILTERS[cat?.slug ?? ''] ?? []
    setFields(filters.map(f => ({ key: f.key, label: f.label, value: '' })))
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 6)
    setImageFiles(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return
    setLoading(true); setError('')

    try {
      // Upload images
      const imageUrls: string[] = []
      for (const file of imageFiles) {
        const fd = new FormData(); fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) { const data = await res.json(); imageUrls.push(data.url) }
      }

      const payload = {
        ...form,
        price: form.price ? Number(form.price) : null,
        subCategoryId: form.subCategoryId || null,
        fields: fields.filter(f => f.value),
        imageUrls,
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) { setError((await res.json()).error ?? 'Failed to create listing'); setLoading(false); return }
      const listing = await res.json()
      router.push(`/listings/${listing.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (status === 'loading') return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1800, margin: '2rem auto', padding: '0 1.25rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.25rem' }}>Post an Ad</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Reach thousands of buyers across Jamaica — free in 5 minutes.</p>

        <form onSubmit={handleSubmit}>
          {/* Tier selector */}
          <Section title="Listing Type">
            <div className='post-ad-2col'>
              {[
                { value: 'FREE', label: 'Free Listing', desc: 'Active for 30 days', price: 'Free' },
                { value: 'PREMIUM', label: '⭐ Premium Listing', desc: 'Active for 60 days · Top placement · Featured badge', price: 'J$1,500' },
              ].map(t => (
                <label key={t.value} style={{
                  display: 'block', padding: '1rem', borderRadius: 12,
                  border: form.tier === t.value ? '2px solid var(--green)' : '1px solid var(--border)',
                  background: form.tier === t.value ? 'var(--green-light)' : '#fff', cursor: 'pointer',
                }}>
                  <input type="radio" name="tier" value={t.value} checked={form.tier === t.value}
                    onChange={() => setForm(f => ({ ...f, tier: t.value }))} style={{ display: 'none' }} />
                  <div style={{ fontWeight: 700, color: form.tier === t.value ? 'var(--green)' : 'var(--ink)', marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6 }}>{t.desc}</div>
                  <div style={{ fontWeight: 700, color: form.tier === t.value ? 'var(--green)' : 'var(--muted)' }}>{t.price}</div>
                </label>
              ))}
            </div>
          </Section>

          {/* Category */}
          <Section title="Category">
            <div className='post-ad-2col'>
              <div>
                <label style={labelStyle}>Category *</label>
                <select required value={form.categoryId} onChange={e => handleCategoryChange(e.target.value)} style={inputStyle}>
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              {(selectedCategory?.subCategories?.length ?? 0) > 0 && (
                <div>
                  <label style={labelStyle}>Sub-category</label>
                  <select value={form.subCategoryId} onChange={e => setForm(f => ({ ...f, subCategoryId: e.target.value }))} style={inputStyle}>
                    <option value="">Select sub-category</option>
                    {selectedCategory?.subCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          </Section>

          {/* Dynamic fields */}
          {dynamicFilters.length > 0 && (
            <Section title="Listing Details">
              <div className='post-ad-3col'>
                {fields.map((f, i) => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <select value={f.value}
                      onChange={e => setFields(prev => prev.map((pf, pi) => pi === i ? { ...pf, value: e.target.value } : pf))}
                      style={inputStyle}>
                      <option value="">Select {f.label}</option>
                      {(CATEGORY_FILTERS[selectedCategory?.slug ?? '']?.find(cf => cf.key === f.key)?.options ?? []).map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Listing info */}
          <Section title="About Your Listing">
            <label style={labelStyle}>Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. 2019 Toyota Corolla — excellent condition" style={{ ...inputStyle, width: '100%', marginBottom: 12 }} />
            <label style={labelStyle}>Description *</label>
            <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe your item in detail — condition, features, reason for selling…"
              rows={5} style={{ ...inputStyle, width: '100%', resize: 'vertical', marginBottom: 12 }} />
            <div className='post-ad-2col'>
              <div>
                <label style={labelStyle}>Price (J$)</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 250000" style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={labelStyle}>Price Display Label</label>
                <input value={form.priceLabel} onChange={e => setForm(f => ({ ...f, priceLabel: e.target.value }))}
                  placeholder="e.g. J$250,000 or Negotiable" style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>
          </Section>

          {/* Location */}
          <Section title="Location">
            <label style={labelStyle}>Parish *</label>
            <select required value={form.parish} onChange={e => setForm(f => ({ ...f, parish: e.target.value }))} style={inputStyle}>
              <option value="">Select parish</option>
              {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Section>

          {/* Images */}
          <Section title="Photos (up to 6)">
            <input type="file" accept="image/*" multiple onChange={handleImages}
              style={{ marginBottom: 12, fontSize: '0.875rem' }} />
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" style={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                ))}
              </div>
            )}
          </Section>

          {/* Contact */}
          <Section title="Contact Information">
            <div className='post-ad-3col'>
              <div>
                <label style={labelStyle}>Contact Name</label>
                <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                  placeholder="Your name" style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                  placeholder="876-XXX-XXXX" style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                  placeholder="your@email.com" style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>
          </Section>

          {error && <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: 'var(--green)', color: '#fff', border: 'none',
            borderRadius: 12, padding: '0.9rem', fontFamily: 'var(--font-sans)',
            fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginBottom: '2rem',
          }}>
            {loading ? 'Posting your ad…' : form.tier === 'PREMIUM' ? '⭐ Post Premium Ad — J$1,500' : 'Post Free Ad'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: '1.25rem' }}>
      <div style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {title}
      </div>
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }
const inputStyle: React.CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: '0.9rem', border: '1px solid var(--border)', borderRadius: 8, padding: '0.55rem 0.75rem', outline: 'none', color: 'var(--ink)', background: '#fff' }
