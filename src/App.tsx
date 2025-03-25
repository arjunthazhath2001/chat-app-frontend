import { useEffect, useRef, useState } from "react"

function App() {
  
  const [messages,setMessages]= useState(["hi","how are you","eirhfvnefirjviomrvoiemtboinwrtjoniwrotjnojimoikmokpm,pl,plo,mpkm,plm,kmoplkmj"])

  const inputRef= useRef(null)

  let wsRef= useRef()
  useEffect(()=>{
    const ws= new WebSocket("ws://localhost:8080")
    ws.onmessage=(event)=>{
        console.log(event)
        setMessages(m=> [...m,event.data])
    }
    wsRef.current=ws
    console.log(wsRef)
    ws.onopen= ()=>{
      ws.send(JSON.stringify({
        "type":"join",
        "payload":{
          "roomId": "red"
        }
      }))
    }

    return ()=>{
      if (wsRef.current.readyState===WebSocket.OPEN){
        wsRef.current.close()
      }
    }
  },[])


  return (
    <div className="h-screen bg-black w-full flex flex-col justify-center gap-5 items-center">        
        <div className="h-[80vh] w-96 bg-black border rounded-2xl border-white mx-auto overflow-auto ">
          {messages.map((message,index)=>
          <div key={index}>
            <span className="bg-white px-5 py-2 inline-block mt-3 ml-3 rounded-xl text-black max-w-[90%] break-words">
              {message}
            </span>
          </div>)}
        </div>
        <div className="flex gap-3 items-center">
          <input ref={inputRef} className="px-4 py-2 rounded-2xl bg-gray-400"/>
          <button onClick={()=>{
            const message= inputRef.current?.value
            wsRef.current.send(JSON.stringify({
              "type":"chat",
              "payload":{
                "message":message
              }
            }))
            inputRef.current.value=""
          }}
          className="bg-white font-bold rounded-lg py-3 cursor-pointer px-6"> Send </button>
        </div>
      

    </div>
    
  )
}

export default App
