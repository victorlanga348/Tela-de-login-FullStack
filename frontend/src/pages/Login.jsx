import { useState } from "react"
import api from "../services/api"
import Input from "../components/Input"
import Button from "../components/Button"

function Login() {
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

        await api.post("/login", {
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
                    <h1 className="text-3xl font-bold mb-4 text-shadow-md">Login</h1>
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <Button onClick={(e) => handleAddTask(e)}>Login</Button>
                    <p className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors active:text-blue-700">Não tem uma conta? <a className="hover:underline" href="/">Cadastre-se</a></p>
                </div>
            </div>
        </>
    )
}

export default Login