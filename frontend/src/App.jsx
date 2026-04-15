import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import ListaCadastro from './pages/ListaCadastro';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/lista-cadastro" element={<ListaCadastro />} />
      </Routes>
    </Router>
  )
}

export default App
