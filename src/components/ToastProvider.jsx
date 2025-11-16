import * as Toast from '@radix-ui/react-toast'
import { createContext, useContext, useState } from 'react'

const ToastCtx = createContext(null)

export function useToasts(){
  return useContext(ToastCtx)
}

export default function ToastProvider({ children }){
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')

  const show = (text) => { setMsg(text); setOpen(true) }

  return (
    <ToastCtx.Provider value={{ show }}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root open={open} onOpenChange={setOpen} className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg">
          <Toast.Title className="font-medium">Notifica</Toast.Title>
          <Toast.Description className="text-sm mt-1">{msg}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="" />
      </Toast.Provider>
    </ToastCtx.Provider>
  )
}
