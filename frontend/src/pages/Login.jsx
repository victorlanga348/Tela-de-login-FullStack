import { useState } from "react"
import api from "../services/api"
import Input from "../components/Input"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

function Login() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        try {
            event.preventDefault() // Evita que a página recarregue ao enviar o formulário

            if(!email || !senha){
                toast.error("Preencha todos os campos")
                return
            }

            // Faz a requisição de login para o backend
            const response = await api.post("/login", {
                email,
                senha
            })

            // SALVANDO O TOKEN: Guardamos o token JWT no localStorage para usar em outras requisições
            localStorage.setItem('token', response.data.token);
            
            toast.success("Login realizado com sucesso!")
            
            // Redireciona o usuário para a página de tarefas
            navigate("/lista-tasks");

        } catch (error) {
            console.error("Erro no login:", error);
            // Mostra o erro retornado pelo backend ou uma mensagem genérica
            toast.error(error.response?.data?.erro || "Usuário ou senha incorreto!");
            setSenha('')
        }
    }  

    const handleCadastro = () => {
        navigate("/cadastro");
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md gap-4 w-[350px]">
                    <h1 className="text-3xl font-bold mb-4 text-shadow-md">Login</h1>
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <Button onClick={(e) => handleLogin(e)}>Login</Button>
                    <p className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors active:text-blue-700">Não tem uma conta? <a className="hover:underline" onClick={handleCadastro}>Cadastre-se</a></p>
                </div>
            </div>
        </>
    )
}

export default Login