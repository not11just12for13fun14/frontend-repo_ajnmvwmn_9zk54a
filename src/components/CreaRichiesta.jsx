import { useState } from 'react'

export default function CreaRichiesta({ utente, onBack }){
  const [form, setForm] = useState({
    creatore_id: utente.id,
    livello_richiesto: utente.livello_di_gioco,
    data: '',
    orario_inizio: '',
    orario_fine: '',
    numero_campo: 1,
    luogo: 'Quanta Club',
    note: '',
    stato: 'Aperta'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/richieste`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      if(!res.ok) throw new Error(await res.text())
      onBack()
    }catch(err){
      setError('Errore creazione richiesta. Assicurati che il luogo sia un Club e i campi siano validi.')
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4">Indietro</button>
      <h2 className="text-2xl font-semibold mb-4">Nuova richiesta</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={submit} className="grid gap-3">
        <div>
          <label className="text-sm text-gray-600">Livello richiesto (1-5)</label>
          <select value={form.livello_richiesto} onChange={e=>setForm({ ...form, livello_richiesto:Number(e.target.value) })} className="w-full border rounded p-2">
            {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Data</label>
            <input type="date" value={form.data} onChange={e=>setForm({ ...form, data:e.target.value })} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Numero campo</label>
            <input type="number" min={1} value={form.numero_campo} onChange={e=>setForm({ ...form, numero_campo:Number(e.target.value) })} className="w-full border rounded p-2" required />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Orario inizio</label>
            <input type="time" value={form.orario_inizio} onChange={e=>setForm({ ...form, orario_inizio:e.target.value })} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Orario fine</label>
            <input type="time" value={form.orario_fine} onChange={e=>setForm({ ...form, orario_fine:e.target.value })} className="w-full border rounded p-2" required />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Luogo Club</label>
          <input value={form.luogo} onChange={e=>setForm({ ...form, luogo:e.target.value })} placeholder="Es. Quanta Club" className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Note</label>
          <textarea value={form.note} onChange={e=>setForm({ ...form, note:e.target.value })} className="w-full border rounded p-2" rows={3} placeholder="Opzionale" />
        </div>
        <button disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-md">{loading?'Creazione...':'Salva richiesta'}</button>
      </form>
    </div>
  )
}
