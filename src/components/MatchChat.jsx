import { useEffect, useRef, useState } from 'react'

export default function MatchChat({ matchId, utente, onBack }){
  const base = import.meta.env.VITE_BACKEND_URL
  const [match, setMatch] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const load = async () => {
    try{
      const mres = await fetch(`${base}/api/match/${matchId}`)
      if(mres.ok){ setMatch(await mres.json()) }
      const res = await fetch(`${base}/api/match/${matchId}/chat`)
      if(res.ok){ setMsgs(await res.json()) }
    } finally {
      setLoading(false)
      setTimeout(()=> bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 0)
    }
  }

  useEffect(()=>{ load(); const t = setInterval(load, 3000); return ()=>clearInterval(t) }, [matchId])

  const send = async (e) => {
    e.preventDefault()
    if(!text.trim()) return
    setSending(true)
    try{
      const res = await fetch(`${base}/api/match/${matchId}/chat`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ sender_id: utente.id, text })
      })
      if(res.ok){
        setText('')
        await load()
      }
    } finally { setSending(false) }
  }

  const isMine = (m) => m.sender_id === utente.id

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4">Indietro</button>
      <div className="bg-white border rounded-xl p-4">
        {loading && <p>Caricamento...</p>}
        {match && (
          <div className="mb-3 text-sm text-gray-700">
            <div className="font-medium">Chat match</div>
            <div>{match.data} {match.orario_inizio}-{match.orario_fine} • Campo {match.numero_campo} • {match.luogo}</div>
          </div>
        )}
        <div className="h-72 overflow-y-auto border rounded p-3 bg-gray-50">
          {msgs.map(m => (
            <div key={m.id} className={`max-w-[80%] mb-2 p-2 rounded ${isMine(m) ? 'ml-auto bg-emerald-100' : 'mr-auto bg-white border'}`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-[10px] text-gray-500 mt-1">{new Date(m.ts*1000).toLocaleTimeString()}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="mt-3 flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded p-2" placeholder="Scrivi un messaggio" />
          <button disabled={sending} className="px-3 py-2 bg-emerald-600 text-white rounded">Invia</button>
        </form>
      </div>
    </div>
  )
}
