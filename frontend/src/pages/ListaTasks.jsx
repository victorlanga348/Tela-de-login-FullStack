import AddTasks from "../components/AddTask";
import Tasks from "../components/Tasks";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

import { toast } from "sonner";

function ListaTasks() {
    
    const navigate = useNavigate();

    // Estado que guarda a lista de tarefas vinda do banco
    const [tasks, setTasks] = useState([]);

    // Função para buscar as tarefas do backend
    async function carregarTarefas() {
        try {
            const response = await api.get('/tarefas'); // O interceptor anexa o token automaticamente
            setTasks(response.data); // Atualiza o estado com as tarefas recebidas
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
            // Se o token estiver expirado ou inválido (401/400), volta para o login
            if (error.response?.status === 401 || error.response?.status === 400) {
                navigate("/");
            }
        }
    }

    // Função chamada pelo AddTask após criar uma nova tarefa
    async function onAddTask() {
        carregarTarefas(); // Recarrega a lista para mostrar a nova tarefa
    }

    // Função para marcar tarefa como concluída/pendente ao clicar nela
    async function onTaskClick(id) {
        const taskClicked = tasks.find(t => t.id === id)
        if(!taskClicked) {
            toast.error("Tarefa não encontrada")
            return
        }

        try {
            // Envia a atualização para o banco
            await api.put(`/tarefas/${id}`, {
                ...taskClicked,
                concluida: !taskClicked.concluida
            })

            carregarTarefas(); // Atualiza a lista na tela
        } catch (error) {
            toast.error("Erro ao atualizar tarefa");
        }
    }

    // Função chamada pelo Tasks após deletar uma tarefa
    async function onDelete() {
        carregarTarefas() // Recarrega a lista para remover a tarefa da tela
    }

    // useEffect roda assim que o componente é montado na tela
    useEffect(() => {
        carregarTarefas();
    }, []); // Array vazio significa que roda apenas uma vez (no "mount")
        
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6">
                <button 
                    className="text-black px-2 py-1 rounded-lg cursor-pointer hover:text-gray-600 transition-colors active:text-gray-700 absolute top-4 left-4"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft />
                </button>
                <AddTasks onAddTask={onAddTask} />
                <Tasks tasks={tasks} onTaskClick={onTaskClick} onDelete={onDelete} />
            </div>
        </>
    )
}

export default ListaTasks