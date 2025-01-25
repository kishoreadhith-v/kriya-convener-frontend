import React from 'react'
import { useEffect,useState } from 'react';
import axios, { Axios } from 'axios';




const ResultPage = () => {
  const [psgWinner,setPsgWinner]=useState("");
  const [psgRunner,setPsgRunner]=useState("");
  const [nonPsgWinner,setNonPsgWinner]=useState("");
  const [nonPsgRunner,setNonPsgRunner]=useState("");
  const [winner,setWinner]=useState("");
  const [runner,setRunner]=useState("");
  const [eventType,setEventType]=useState("");

  useEffect(()=>{
    const eventID=window.localStorage.getItem("user");
    if (eventID.charAt(0)==="P")
    {
      setEventType("Paper");
    }
    else if(eventID==="EVNT0001" || eventID==="EVNT0020" || eventID==="EVNT0026" || eventID==="EVNT0030" || eventID==="EVNT0031" || eventID==="EVNT0034")
    {
      setEventType("Gold");
    }
    else
    {
      setEventType("event");
    }
  },[])

  async function handleSubmit(e)
  {
    e.preventDefault();

    const formData=new FormData();
    formData.append("eventID", window.localStorage.getItem("user"));
    formData.append("psgWinnerKriyaID", psgWinner);
    formData.append("psgRunnerKriyaID", psgRunner);
    formData.append("nonPsgWinnerKriyaID", nonPsgWinner);
    formData.append("nonPsgRunnerKriyaID", nonPsgRunner);
    formData.append("category",eventType);
    formData.append("winner",winner);
    formData.append("runner",runner);

    try{
      const result=await axios.post("http://localhost:3000",formData,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(result);
    }
    catch(e)
    {
      console.log(e);
    }


    setPsgWinner("");
    setWinner("");
    setRunner("");
    setPsgRunner("");
    setNonPsgRunner("");
    setNonPsgWinner("");
  }


  return (
    <div className="h-full w-full overflow-y-auto font-poppins flex flex-col justify-center items-center  pb-16 px-4">

    <h1 className='text-4xl font-semibold text-sky-900 mb-8'>RESULT</h1>

    <form className='flex space-y-20 flex-col h-full w-full justify-start py-8 items-center' onSubmit={handleSubmit}> 

    

    {eventType==="event"?(<div>
      <div className='flex flex-col w-full justify-center items-center'>

    <h1 className='font-semibold text-3xl text-sky-900 mb-8'>PSG Participants</h1>

    <div className='flex space-x-10 w-full justify-evenly items-center'>

    <div className='flex flex-col justify-center text-left space-y-3'>
    <div className='flex flex-col text-left'>
    <h1 className='font-semibold text-2xl text-sky-900'>Winner</h1>
    <p>*KriyaID</p>
    </div>
    <input type='text' className='rounded' value={psgWinner} onChange={(e)=>{setPsgWinner(e.target.value)}}/>

    </div>

    <div className='flex flex-col justify-center text-left space-y-3'>
    <div className='flex flex-col text-left'>
    <h1 className='font-semibold text-2xl text-sky-900'>Runner</h1>
    <p>*KriyaID</p>
    </div>
    <input type='text' className='rounded' value={psgRunner} onChange={(e)=>{setPsgRunner(e.target.value)}}/>

    </div>

    </div>


    </div>

    <div className='flex flex-col w-full justify-center items-center'>

    <h1 className='font-semibold text-3xl text-sky-900 mb-8'>Non PSG Participants</h1>

    <div className='space-x-10 flex w-full justify-evenly items-center'>

    <div className='flex flex-col justify-start text-left space-y-3'>
    <div className='flex flex-col text-left'>
    <h1 className='font-semibold text-2xl text-sky-900'>Winner</h1>
    <p>*KriyaID</p>
    </div>
    <input type='text' className='rounded' value={nonPsgWinner} onChange={(e)=>{setNonPsgWinner(e.target.value)}}/>

    </div>

    <div className='flex flex-col justify-start text-left space-y-3'>
    <div className='flex flex-col text-left'>
    <h1 className='font-semibold text-2xl text-sky-900'>Runner</h1>
    <p>*KriyaID</p>
    </div>
    <input type='text' className='rounded' value={nonPsgRunner} onChange={(e)=>{setNonPsgRunner(e.target.value)}}/>

    </div>

    </div>


    </div>
    </div>):
    (
      <div className='flex flex-col w-full justify-center items-center'>

    <h1 className='font-semibold text-3xl text-sky-900 mb-8'>Participants</h1>

    <div className='flex space-x-10 w-full justify-evenly items-center'>

    <div className='flex flex-col justify-center text-left space-y-3'>
    <div className='flex flex-col text-left'>
    <h1 className='font-semibold text-2xl text-sky-900'>Winner</h1>
    <p>*KriyaID</p>
    </div>
    <input type='text' className='rounded' value={winner} onChange={(e)=>{setWinner(e.target.value)}}/>

    </div>

    <div className='flex flex-col justify-center text-left space-y-3'>
    <div className='flex flex-col text-left'>
    <h1 className='font-semibold text-2xl text-sky-900'>Runner</h1>
    <p>*KriyaID</p>
    </div>
    <input type='text' className='rounded' value={runner} onChange={(e)=>{setRunner(e.target.value)}}/>

    </div>

    </div>


    </div>
    )
    }

    <button type='submit' className='bg-sky-900 text-white p-2 rounded-lg'>Submit</button>
    

    </form>


    </div>
  )
}

export default ResultPage