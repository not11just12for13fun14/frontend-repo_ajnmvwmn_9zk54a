import { useEffect, useMemo, useState } from 'react'
import MapSelector from './MapSelector'
import { Spinner } from './Loaders'
import { useToasts } from './ToastProvider'

function Filtro({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-600">{label}</span>
      {children}
    </div>
  )
}

function CardRichiesta({ r, onDettagli, onAccetta }){
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2 bg-white">
      <div className="flex justify-between">
        <div className="font-medium">{r.creatore_nome ? `${r.creatore_nome} • ` : ''}Livello richiesto: {r.livello_richiesto}</div>
        <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{r.stato}</div>
      </div>
      <div className="text-sm text-gray-700">Data: {r.data} • {r.orario_inizio} - {r.orario_fine}</div>
      <div className="text-sm text-gray-700">Campo: {r.numero_campo} • Luogo: {r.luogo}</div>
      <div className="flex gap-2 mt-2">
        <button onClick={()=>onDettagli(r)} className="px-3 py-1 text-sm border rounded-md">Dettagli</button>
        <button onClick={()=>onAccetta(r)} className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md">Accetta e unisciti</button>
      </div>
    </div>
  )
}

export default function Richieste({ utente, onCrea }){
  const [f, setF] = useState({ livello_richiesto:'', data:'', orario:'', numero_campo:'' })
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)
  const base = import.meta.env.VITE_BACKEND_URL
  const [qClub, setQClub] = useState('')
  const [suggerimenti, setSuggerimenti] = useState([])
  const [selectedPos, setSelectedPos] = useState(null)
  const { show } = useToasts()

  const fetchList = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (f.livello_richiesto) params.append('livello_richiesto', f.livello_richiesto)
    if (f.data) params.append('data', f.data)
    if (f.orario) params.append('orario', f.orario)
    if (f.numero_campo) params.append('numero_campo', f.numero_campo)
    const res = await fetch(`${base}/api/richieste?${params.toString()}`)
    const data = await res.json()
    setLista(data)
    setLoading(false)
  }

  const fetchClub = async (q) => {
    if(!q) { setSuggerimenti([]); return }
    const res = await fetch(`${base}/api/club?q=${encodeURIComponent(q)}`)
    if(res.ok){ setSuggerimenti(await res.json()) }
  }

  useEffect(()=>{ fetchList() }, [])

  const accetta = async (r) => {
    const res = await fetch(`${base}/api/richieste/${r.id}/accetta`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ utente_id: utente.id })
    })
    if (res.ok) {
      await fetchList()
      show('Match confermato! Email inviate ai partecipanti')
    } else {
      show('Impossibile accettare la richiesta')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Richieste di gioco</h2>
        <button onClick={onCrea} className="px-3 py-2 bg-emerald-600 text-white rounded-md">Crea richiesta</button>
      </div>
      <div className="grid sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border mb-4">
        <Filtro label="Livello">
          <select value={f.livello_richiesto} onChange={e=>setF({...f, livello_richiesto:e.target.value})} className="border rounded p-2">
            <option value="">Tutti</option>
            {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </Filtro>
        <Filtro label="Data">
          <input type="date" value={f.data} onChange={e=>setF({...f, data:e.target.value})} className="border rounded p-2" />
        </Filtro>
        <Filtro label="Orario">
          <input type="time" value={f.orario} onChange={e=>setF({...f, orario:e.target.value})} className="border rounded p-2" />
        </Filtro>
        <Filtro label="Campo">
          <input type="number" min={1} value={f.numero_campo} onChange={e=>setF({...f, numero_campo:e.target.value})} className="border rounded p-2" />
        </Filtro>
        <div className="sm:col-span-4 flex flex-col gap-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Cerca club</div>
              <input value={qClub} onChange={e=>{ setQClub(e.target.value); fetchClub(e.target.value) }} placeholder="Es. Milano, Quanta..." className="w-full border rounded p-2" />
              {qClub && suggerimenti.length>0 && (
                <div className="bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                  {suggerimenti.map((c,i)=> (
                    <div key={i} className="px-3 py-2 hover:bg-emerald-50 cursor-pointer" onClick={()=>{ setQClub(c.nome); setSelectedPos([c.lat, c.lon]); }}>
                      <div className="font-medium">{c.nome}</div>
                      <div className="text-xs text-gray-600">{c.citta} • {c.lat.toFixed(3)}, {c.lon.toFixed(3)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={fetchList} className="px-3 py-2 bg-gray-800 text-white rounded">Applica filtri</button>
            <button onClick={()=>{setF({ livello_richiesto:'', data:'', orario:'', numero_campo:'' }); setQClub(''); setSuggerimenti([]); setSelectedPos(null); fetchList()}} className="px-3 py-2 border rounded">Reset</button>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Mappa club (clicca per selezionare)</div>
            <MapSelector marker={selectedPos} onSelect={(lat, lon)=>{ setSelectedPos([lat, lon]); show(`Selezionato: ${lat.toFixed(4)}, ${lon.toFixed(4)}`) }} />
          </div>
        </div>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-3">
          {lista.map(r => <CardRichiesta key={r.id} r={r} onDettagli={()=>alert(r.note || 'Nessuna nota')} onAccetta={accetta} />)}
          {lista.length===0 && <p className="text-gray-600">Nessuna richiesta aperta.</p>}
        </div>
      )}
    </div>
  )
}
