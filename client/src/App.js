import './App.css';
import React, { useEffect } from 'react';
import { AllRoutes } from './Routes/AllRoutes';
import { useNavigate } from 'react-router';
import { loadData, saveData } from "./Utils/localstorage"

function App() {
  let navigate = useNavigate();
  let auth = loadData("auth");

  const handleLogout = () => {
    saveData("email", "")
    saveData("token", "")
    saveData("auth", false)
    navigate("login");
  }


  return (
    <div className="w-screen h-screen flex flex-col">
      <div className='bg-blue-500 flex drop-shadow p-2 justify-between'>
        <p className='font-bold text-slate-200 text-xl md:text-3xl'>Foody</p>
        {
          auth === true &&
          <button onClick={() =>  handleLogout()} className="text-slate-200 hover:bg-blue-600 rounded px-2">Log out</button>
        }
      </div>
      <AllRoutes />
    </div>
  );
}

export default App;
