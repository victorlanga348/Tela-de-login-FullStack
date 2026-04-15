import { useNavigate } from "react-router-dom";
import { MoveLeft, Trash } from 'lucide-react';
import api from "../services/api";
import { useState, useEffect } from "react";


function ListaCadastro() {
    const navigate = useNavigate();

    const [dados, setDados] = useState([]);

    useEffect(() => {
        const buscarDados = async () => {
            const response = await api.get("/status");
            setDados(response.data);
        }
        buscarDados();
    }, []);

    const handleLogin = () => {
        navigate("/");
    }

    const handleDelete = async (id) => {
        await api.delete(`/delete/${id}`);
        setDados(dados.filter((dado) => dado.id !== id));
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <button
                    onClick={() => handleLogin()}
                    className="absolute top-4 left-4 cursor-pointer hover:text-blue-600 transition-colors active:text-blue-700"
                >
                    <MoveLeft />
                </button>
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md gap-3 w-[500px]">
                    <h1 className="text-3xl font-bold mb-4 text-shadow-md">Lista dos usuários cadastrados</h1>
                    {dados.map((dado) => (
                        <ul key={dado.id}>
                            <li className="flex items-center justify-between text-center w-[400px] border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:text-blue-600 transition-colors active:text-blue-700">
                                <p>{dado.id}</p>
                                <p>{dado.email}</p>
                                <button
                                    onClick={() => handleDelete(dado.id)}
                                    className="cursor-pointer hover:text-red-600 transition-colors active:text-red-700"
                                >
                                    <Trash />
                                </button>
                            </li>
                        </ul>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ListaCadastro