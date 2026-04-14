import Button from "../components/Button";

function Home() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md gap-3 w-[350px]">
                    <h1 className="text-3xl font-bold mb-2 text-shadow-md">Lista de usuários</h1>
                    <Button onClick={(e) => handleAddTask(e)}>Login</Button>
                    <Button onClick={(e) => handleAddTask(e)}>Cadastrar</Button>
                    <p> <span className="font-bold">NB:</span> Esta página só pode ser acessada por usuários logados, caso não tenha uma conta, cadastre-se</p>
                </div>
            </div>
        </>
    )
}

export default Home