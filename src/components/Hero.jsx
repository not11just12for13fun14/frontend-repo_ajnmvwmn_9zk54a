import { Star } from 'lucide-react'

export default function Hero({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-xl">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Star className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">MatchTennis</h1>
        <p className="text-gray-600 mt-2">Trova compagni di gioco vicino a te e conferma un match in pochi tap.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => onStart('login')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">Accedi</button>
          <button onClick={() => onStart('register')} className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition">Registrati</button>
        </div>
      </div>
    </div>
  )
}
