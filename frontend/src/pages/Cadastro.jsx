import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import api from "../services/api";

function Cadastro() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const handleAddTask = async (event) => {
        event.preventDefault()

        console.log("chegou")

        if(!email || !senha){
            alert("Preencha todos os campos")
            return
        }
        console.log(email, senha)

        await api.post("/cadastro", {
            email,
            senha
        })

        console.log("enviou")
        setEmail('')
        setSenha('')
    }  

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md gap-4 w-[350px]">
                    <h1 className="text-3xl font-bold mb-4 text-shadow-md">Cadastro</h1>
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <Button onClick={(e) => handleAddTask(e)}>Cadastrar</Button>
                    <p className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors active:text-blue-700">Já tem uma conta? <a className="hover:underline" href="/login">Faça login</a></p>
                </div>
            </div>
        </>
    )
}

export default Cadastro