import Input from "./Input"
import Button from "./Button"
import { useState } from "react"
import api from "../services/api"
import { toast } from "sonner"
import { useParams, useNavigate } from "react-router-dom"

function Edit() {
    const [task, setTask] = useState("")
    const [description, setDescription] = useState("")
    const { id } = useParams()
    const navigate = useNavigate()

    async function editTask(e){
        e.preventDefault()

        if(!task.trim() || !description.trim()) {
            toast.error("Preencha todos os campos")
            return
        }

        try {
            await api.patch(`/alt-tarefas/${id}`, {
                task,
                description,
            })
            toast.success("Tarefa editada com sucesso!")

            navigate("/lista-tasks")
        } catch (error) {
            toast.error("Erro ao editar tarefa")
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md gap-4 w-[350px]">
                <h1 className="text-3xl font-bold mb-4 text-shadow-md">Editar Tarefa</h1>
                <Input placeholder="Task" value={task} onChange={(e) => setTask(e.target.value)} />
                <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Button onClick={editTask}>Editar</Button>
            </div>
        </>
    )
}

export default Edit