import { useState } from 'react'

function LivelloSelect({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(Number(e.target.value))} className="w-full border rounded-md p-2">
      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
    </select>
  )
}

export function Login({ onSuccess, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onSuccess(data)
    } catch (err) { setError('Credenziali non valide') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4">Indietro</button>
      <h2 className="text-2xl font-semibold mb-4">Accedi</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border rounded-md p-2" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded-md p-2" required />
        <button disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-md">{loading?'Attendere...':'Accedi'}</button>
      </form>
    </div>
  )
}

export function Register({ onSuccess, onBack }) {
  const [form, setForm] = useState({ nome:'', cognome:'', email:'', password:'', livello_di_gioco:3 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registrazione`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onSuccess(data)
    } catch (err) { setError('Registrazione non riuscita. Verifica i dati.') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4">Indietro</button>
      <h2 className="text-2xl font-semibold mb-4">Crea un account</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} placeholder="Nome" className="w-full border rounded-md p-2" required />
        <input value={form.cognome} onChange={e=>setForm({...form, cognome:e.target.value})} placeholder="Cognome" className="w-full border rounded-md p-2" required />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} type="email" placeholder="Email" className="w-full border rounded-md p-2" required />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} type="password" placeholder="Password (min 6)" className="w-full border rounded-md p-2" required />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Livello di gioco (1-5)</label>
          <LivelloSelect value={form.livello_di_gioco} onChange={v=>setForm({...form, livello_di_gioco:v})} />
          <p className="text-xs text-gray-500 mt-1">1 principianti • 3 intermedio • 5 avanzato</p>
        </div>
        <button disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-md">{loading?'Creazione...':'Registrati'}</button>
      </form>
    </div>
  )
}
