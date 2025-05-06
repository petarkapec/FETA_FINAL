"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
            email,
            password
        });

        // Spremi token i informacije o DJ-u u localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('dj', JSON.stringify(response.data.izvodjac));
        

        // Preusmjeri na /profil
        navigate('/profil');
    } catch (error) {
        console.error('Login failed', error);
    }
};

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
        
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
      <Button className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium">
              Postani i ti dio FETA tima!
            </Button>
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-4">
            
          </div>

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1C2541] border-[#3A506B] text-white placeholder:text-[#3A506B] h-12"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1C2541] border-[#3A506B] text-white placeholder:text-[#3A506B] h-12"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium h-12"
            >
              Login
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;