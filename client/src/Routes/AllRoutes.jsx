import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Homepage } from "./Homepage";
import { Login } from "./Login";
import { Registration } from "./Registration";
import { NotFound } from "./NotFound";

const AllRoutes = () => {
    return (
        <div className="bg-slate-400 w-screen h-screen overflow-auto">
            <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/registration" element={<Registration />} />
                <Route exact path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export { AllRoutes }