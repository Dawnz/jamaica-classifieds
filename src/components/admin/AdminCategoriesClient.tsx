'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type SubCat = { id: string; name: string; slug: string; isActive: boolean }
type Category = { id: string; name: string; slug: string; icon: string | null; isActive: boolean; order: number; subCategories: SubCat[]; _count: { listings: number } }

export default function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newCat, setNewCat] = useState({ name: '', icon: '', slug: '' })
  const [newSub, setNewSub] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  async function addCategory() {
    if (!newCat.name) return
    setSaving(true)
    const slug = newCat.slug || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newCat, slug, order: categories.length + 1 }) })
    setNewCat({ name: '', icon: '', slug: '' }); setSaving(false)
    startTransition(() => router.refresh())
  }

  async function toggleCategory(id: string, isActive: boolean) {
    await fetch(`/api/admin/categories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !isActive }) })
    startTransition(() => router.refresh())
  }

  async function addSubCategory(catId: string) {
    const name = newSub[catId]
    if (!name) return
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug, categoryId: catId }) })
    setNewSub(s => ({ ...s, [catId]: '' }))
    startTransition(() => router.refresh())
  }

  return (
    <div>
      {/* Add Category */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Add New Category</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={lbl}>Icon (emoji)</label>
            <input value={newCat.icon} onChange={e => setNewCat(c => ({ ...c, icon: e.target.value }))} placeholder="🏠" style={{ ...inp, width: 70, textAlign: 'center', fontSize: '1.2rem' }} />
          </div>
          <div>
            <label style={lbl}>Category Name *</label>
            <input value={newCat.name} onChange={e => setNewCat(c => ({ ...c, name: e.target.value }))} placeholder="Category name" style={{ ...inp, minWidth: 200 }} />
          </div>
          <div>
            <label style={lbl}>Slug (auto-generated)</label>
            <input value={newCat.slug} onChange={e => setNewCat(c => ({ ...c, slug: e.target.value }))} placeholder="auto-from-name" style={{ ...inp, minWidth: 180 }} />
          </div>
          <button onClick={addCategory} disabled={saving || !newCat.name} style={greenBtn}>{saving ? 'Adding…' : '+ Add Category'}</button>
        </div>
      </div>

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Category row */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0.85rem 1.25rem', gap: 12, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}>
              <span style={{ fontSize: '1.3rem', width: 30, textAlign: 'center' }}>{cat.icon ?? '📦'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>{cat.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  /{cat.slug} · {cat._count.listings} listings · {cat.subCategories.length} sub-categories
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: cat.isActive ? '#D1FAE5' : '#F3F4F6', color: cat.isActive ? '#065F46' : '#6B7280' }}>
                {cat.isActive ? 'Active' : 'Hidden'}
              </span>
              <button onClick={e => { e.stopPropagation(); toggleCategory(cat.id, cat.isActive) }}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--muted)', fontWeight: 600 }}>
                {cat.isActive ? 'Hide' : 'Show'}
              </button>
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{expanded === cat.id ? '▲' : '▼'}</span>
            </div>

            {/* Sub-categories expanded panel */}
            {expanded === cat.id && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.25rem', background: 'var(--subtle)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '0.75rem' }}>
                  {cat.subCategories.map(s => (
                    <span key={s.id} style={{ background: s.isActive ? 'var(--green-light)' : '#F3F4F6', color: s.isActive ? 'var(--green)' : 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>
                      {s.name}
                    </span>
                  ))}
                  {cat.subCategories.length === 0 && <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>No sub-categories yet</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={newSub[cat.id] ?? ''} onChange={e => setNewSub(s => ({ ...s, [cat.id]: e.target.value }))}
                    placeholder="New sub-category name…" style={{ ...inp, flex: 1, maxWidth: 300 }}
                    onKeyDown={e => e.key === 'Enter' && addSubCategory(cat.id)} />
                  <button onClick={() => addSubCategory(cat.id)} style={greenBtn}>+ Add Sub</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }
const inp: React.CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: '0.875rem', border: '1px solid var(--border)', borderRadius: 8, padding: '0.5rem 0.75rem', outline: 'none', color: 'var(--ink)' }
const greenBtn: React.CSSProperties = { background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }
