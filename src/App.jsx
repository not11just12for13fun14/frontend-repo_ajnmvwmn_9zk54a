import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import { Login, Register } from './components/AuthForms'
import Richieste from './components/Richieste'
import CreaRichiesta from './components/CreaRichiesta'

function Navbar({ utente, onLogout, onProfilo, onHome }){
  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <button onClick={onHome} className="font-bold text-emerald-700">MatchTennis</button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">{utente.nome} {utente.cognome} • Livello {utente.livello_di_gioco}</span>
          <button onClick={onProfilo} className="text-sm border rounded px-2 py-1">Profilo</button>
          <button onClick={onLogout} className="text-sm bg-gray-800 text-white rounded px-2 py-1">Logout</button>
        </div>
      </div>
    </div>
  )
}

function Profilo({ utente, onAggiorna, onBack }){
  const [level, setLevel] = useState(utente.livello_di_gioco)
  const [loading, setLoading] = useState(false)
  const salva = async () => {
    setLoading(true)
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/utenti/${utente.id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ livello_di_gioco: Number(level) })
    })
    const data = await res.json()
    onAggiorna(data)
    setLoading(false)
  }
  return (
    <div className="max-w-xl mx-auto p-6">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4">Indietro</button>
      <h2 className="text-2xl font-semibold mb-4">Profilo utente</h2>
      <div className="grid gap-3">
        <div className="flex gap-3"><div className="w-1/2"><label className="text-sm text-gray-600">Nome</label><input disabled value={utente.nome} className="w-full border rounded p-2"/></div><div className="w-1/2"><label className="text-sm text-gray-600">Cognome</label><input disabled value={utente.cognome} className="w-full border rounded p-2"/></div></div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input disabled value={utente.email} className="w-full border rounded p-2"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">Livello di gioco</label>
          <select value={level} onChange={e=>setLevel(e.target.value)} className="w-full border rounded p-2">
            {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
          <p className="text-xs text-gray-500 mt-1">1 principianti • 3 intermedio • 5 avanzato</p>
        </div>
        <button disabled={loading} onClick={salva} className="bg-emerald-600 text-white py-2 rounded">{loading?'Salvataggio...':'Salva modifiche'}</button>
      </div>
    </div>
  )
}

function LeMie({ utente, onBack }){
  const [dati, setDati] = useState({ aperte: [], match_confermati: [] })
  const load = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/miei/${utente.id}`)
    const data = await res.json()
    setDati(data)
  }
  useEffect(()=>{ load() }, [])
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4">Indietro</button>
      <h2 className="text-2xl font-semibold mb-4">Le mie richieste</h2>
      <div className="grid gap-2">
        <h3 className="font-medium">Aperte</h3>
        {dati.aperte.map(r=> <div key={r.id} className="border rounded p-3 bg-white">{r.data} {r.orario_inizio}-{r.orario_fine} • Campo {r.numero_campo} • {r.luogo}</div>)}
        {dati.aperte.length===0 && <p className="text-sm text-gray-600">Nessuna richiesta aperta.</p>}
      </div>
      <div className="grid gap-2 mt-6">
        <h3 className="font-medium">Match confermati</h3>
        {dati.match_confermati.map(m=> <div key={m.id} className="border rounded p-3 bg-white">{m.data} {m.orario_inizio}-{m.orario_fine} • Campo {m.numero_campo} • {m.luogo}</div>)}
        {dati.match_confermati.length===0 && <p className="text-sm text-gray-600">Nessun match confermato.</p>}
      </div>
    </div>
  )
}

export default function App(){
  const [screen, setScreen] = useState('onboarding')
  const [utente, setUtente] = useState(null)
  const goHome = () => setScreen('home')

  useEffect(()=>{
    if(!import.meta.env.VITE_BACKEND_URL){
      console.warn('Configura VITE_BACKEND_URL per comunicare con il backend')
    }
  }, [])

  if(!utente){
    if(screen === 'onboarding') return <Hero onStart={(s)=>setScreen(s)} />
    if(screen === 'login') return <Login onBack={()=>setScreen('onboarding')} onSuccess={(u)=>{ setUtente(u); setScreen('home') }} />
    if(screen === 'register') return <Register onBack={()=>setScreen('onboarding')} onSuccess={(u)=>{ setUtente(u); setScreen('home') }} />
  }

  if(!utente) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar utente={utente} onLogout={()=>{ setUtente(null); setScreen('onboarding') }} onProfilo={()=>setScreen('profilo')} onHome={goHome} />
      {screen === 'home' && <Richieste utente={utente} onCrea={()=>setScreen('crea')} />}
      {screen === 'crea' && <CreaRichiesta utente={utente} onBack={goHome} />}
      {screen === 'profilo' && <Profilo utente={utente} onAggiorna={(u)=>{ setUtente(u); goHome() }} onBack={goHome} />}
      {screen === 'mie' && <LeMie utente={utente} onBack={goHome} />}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button onClick={()=>setScreen('mie')} className="px-3 py-2 bg-white border rounded shadow">Le mie richieste</button>
      </div>
    </div>
  )
}
