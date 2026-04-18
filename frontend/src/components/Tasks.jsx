import { Trash2, Eye, X, CheckCircle2, SquarePen } from 'lucide-react'
import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

function Tasks(props) {
    const navigate = useNavigate()
    // Estado para controlar qual tarefa está sendo exibida no modal de detalhes
    const [selectedTask, setSelectedTask] = useState(null)

    // Abre o modal de detalhes (e impede que o clique dispare o onTaskClick do pai)
    function onSeeDetailsClicked(e, task) {
        e.stopPropagation(); // IMPORTANTE: Impede que o clique na linha também ative a tarefa
        setSelectedTask(task)
    }

    // Deleta a tarefa (e impede que o clique dispare o onTaskClick do pai)
    async function onDeleteClicked(e, id) {
        e.stopPropagation(); // IMPORTANTE: Impede que o clique na linha também ative a tarefa
        try {
            await api.delete(`/tarefas/${id}`)
            props.onDelete() // Notifica o componente pai para atualizar a lista
        } catch (error) {
            toast.error("Erro ao deletar:", error)
        }
    }

    async function onEditTaskCliked(e, id){
        e.stopPropagation(); // IMPORTANTE: Impede que o clique na 
        navigate(`/edit-task/${id}`)
    }
    
    return (
        <>
            <div className="flex flex-col items-center justify-center bg-white p-5 rounded-lg shadow-md gap-3 w-[350px]">
                <h1 className="text-2xl font-bold">Tarefas</h1>
                <ul className="flex flex-col w-full gap-3">
                    {props.tasks && props.tasks.length > 0 ? (
                        props.tasks.map((task) => (
                            <li 
                                key={task.id}
                                className={`flex items-center justify-between border-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors active:bg-gray-200 ${task.concluida ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                                onClick={() => props.onTaskClick(task.id)}
                            >
                                <div className="flex items-center gap-2">
                                    {task.concluida && <CheckCircle2 className="text-green-500" size={18} />}
                                    <p className={`font-semibold ${task.concluida ? 'line-through text-gray-500' : ''}`}>
                                        {task.task}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        className="bg-gray-500 text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors active:bg-gray-700" 
                                        onClick={(e) => onEditTaskCliked(e, task.id)}
                                    >
                                        <SquarePen />
                                    </button>
                                    <button 
                                        className="bg-blue-500 text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors active:bg-blue-700" 
                                        onClick={(e) => onSeeDetailsClicked(e, task)}
                                    >
                                        <Eye />
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-red-600 transition-colors active:bg-red-700" 
                                        onClick={(e) => onDeleteClicked(e, task.id)}
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Nenhuma tarefa encontrada.</p>
                    )}
                </ul>
                <p className='text-gray-500 text-center'><span className='font-bold'>NB:</span> As tarefas desaparecem após 24h.</p>
            </div>

            {selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl gap-3 w-full max-w-lg relative animate-in fade zoom-in duration-200 w-[350px]">
                        <button
                            className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                            onClick={() => setSelectedTask(null)}
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 pr-6">{selectedTask.task}</h2>
                        <div className="mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${selectedTask.concluida ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {selectedTask.concluida ? 'Concluída' : 'Pendente'}
                            </span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap">{selectedTask.description}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Tasks
