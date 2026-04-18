import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import api from "../services/api"
import Edit from "../components/Edit"
import { ArrowLeft } from "lucide-react"

function EditTask() {
    const navigate = useNavigate()

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6">
                <button 
                    className="text-black px-2 py-1 rounded-lg cursor-pointer hover:text-gray-600 transition-colors active:text-gray-700 absolute top-4 left-4"
                    onClick={() => navigate("/lista-tasks")}
                >
                    <ArrowLeft />
                </button>
                <Edit />
            </div>
        </>
    )
}

export default EditTask