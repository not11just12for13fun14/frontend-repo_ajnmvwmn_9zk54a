import { useEffect, useState } from 'react'

export default function DettaglioRichiesta({ richiestaId, utente, onBack, onAggiorna }){
  const base = import.meta.env.VITE_BACKEND_URL
  const [r, setR] = useState(null)
  const [creatore, setCreatore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try{
      const res = await fetch(`${base}/api/richieste/${richiestaId}`)
      if(!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setR(data)
      const ures = await fetch(`${base}/api/utenti/${data.creatore_id}`)
      if(ures.ok){ setCreatore(await ures.json()) }
    }catch(e){ setError('Richiesta non trovata') }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [richiestaId])

  const accetta = async () => {
    if(!r) return
    const res = await fetch(`${base}/api/richieste/${r.id}/accetta`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ utente_id: utente.id })
    })
    if(res.ok){
      alert('Match confermato!')
      onAggiorna && onAggiorna()
      onBack()
    } else {
      const msg = await res.text()
      alert('Impossibile accettare la richiesta: ' + msg)
    }
  }

  const annulla = async () => {
    if(!r) return
    if(!confirm('Confermi di annullare questa richiesta?')) return
    const res = await fetch(`${base}/api/richieste/${r.id}/annulla`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ creatore_id: utente.id })
    })
    if(res.ok){
      alert('Richiesta annullata')
      onAggiorna && onAggiorna()
      onBack()
    } else {
      const msg = await res.text()
      alert('Impossibile annullare la richiesta: ' + msg)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4">Indietro</button>
      {loading && <p>Caricamento...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {r && (
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <h2 className="text-2xl font-semibold">Dettaglio richiesta</h2>
          <div className="text-sm text-gray-700">Creato da: <span className="font-medium">{creatore ? `${creatore.nome} ${creatore.cognome}` : '...'}</span></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">Livello richiesto</div>
              <div className="font-medium">{r.livello_richiesto}</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">Numero campo</div>
              <div className="font-medium">{r.numero_campo}</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">Data</div>
              <div className="font-medium">{r.data}</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">Orari</div>
              <div className="font-medium">{r.orario_inizio} - {r.orario_fine}</div>
            </div>
            <div className="p-3 border rounded-lg sm:col-span-2">
              <div className="text-xs text-gray-500">Luogo (Club)</div>
              <div className="font-medium">{r.luogo}</div>
            </div>
          </div>
          <div className="p-3 border rounded-lg bg-emerald-50">
            <div className="text-xs text-gray-600">Note</div>
            <div className="text-sm">{r.note || 'Nessuna nota'}</div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {r.stato === 'Aperta' && <button onClick={accetta} className="px-4 py-2 bg-emerald-600 text-white rounded-md">Accetta e unisciti</button>}
            {utente.id === r.creatore_id && r.stato === 'Aperta' && (
              <button onClick={annulla} className="px-4 py-2 border rounded-md">Annulla richiesta</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
