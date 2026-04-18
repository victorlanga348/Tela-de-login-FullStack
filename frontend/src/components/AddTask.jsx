import Input from "./Input"
import Button from "./Button"
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";

function AddTask(props) {
    // Estados para os campos de entrada (tarefa e descrição)
    const [task, setTask] = useState("")
    const [description, setDescription] = useState("")

    // Função para enviar a nova tarefa para o servidor
    const handleAddTask = async (event) => {
        event.preventDefault();
        try {
            // Validação: não permite campos vazios
            if(!task.trim() || !description.trim()) {
                toast.error("Preencha todos os campos")
                return
            }

            // Envia os dados para a API (o interceptor anexa o token automaticamente)
            await api.post('/tarefas', {
                task,
                description
            })

            toast.success("Tarefa adicionada com sucesso!")
            
            // Limpa os campos do formulário após o sucesso
            setTask("")
            setDescription("")
            
            // Avisa o componente pai (ListaTasks) para recarregar a lista
            props.onAddTask()
        } catch (error) {
            toast.error("Erro ao adicionar tarefa")
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-white p-5 rounded-lg shadow-md gap-3 w-[350px]">
                <h1 className="text-2xl font-bold">Adicionar Tarefa</h1>
                <Input
                    type="text"
                    placeholder="Tarefa"
                    value={task}
                    onChange={(event) => setTask(event.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Descrição"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
                <Button onClick={handleAddTask}>Adicionar</Button>
            </div>
        </>
    )
}

export default AddTask  