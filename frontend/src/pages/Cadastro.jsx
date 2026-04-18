import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Cadastro() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const navigate = useNavigate();

    const handleCadastro = async (event) => {
        try {
            event.preventDefault() // Evita o recarregamento da página

            if(!email || !senha){
                toast.error("Preencha todos os campos")
                return
            }

            // Envia os dados para a rota de cadastro no backend
            await api.post("/cadastro", {
                email,
                senha
            })

            toast.success("Cadastro realizado com sucesso!")
            
            // Após cadastrar, redireciona automaticamente para a página de login
            navigate("/");

        } catch (error) {
            // Mostra erro se o e-mail já estiver em uso ou houver falha no servidor
            toast.error(error.response?.data?.erro || "Erro ao cadastrar!");
            setSenha('')
        }
    }  

    const handleLogin = () => {
        navigate("/");
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md gap-4 w-[350px]">
                    <h1 className="text-3xl font-bold mb-4 text-shadow-md">Cadastro</h1>
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <Button onClick={(e) => handleCadastro(e)}>Cadastrar</Button>
                    <p className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors active:text-blue-700">Já tem uma conta? <a className="hover:underline" onClick={handleLogin}>Faça login</a></p>
                </div>
            </div>
        </>
    )
}

export default Cadastro