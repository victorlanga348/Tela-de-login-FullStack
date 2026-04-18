import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Middleware para verificar se o usuário está logado
function verificarToken(req, res, next) {
    const token = req.headers['authorization']; // Pega o token enviado pelo frontend

    if (!token) return res.status(401).json({ erro: "Acesso negado. Cadê o token?" });

    try {
        // Remove a palavra 'Bearer' se ela vier junto com o token
        const tokenLimpo = token.split(" ")[1] || token;
        
        // Valida o token usando a chave secreta definida no arquivo .env
        const decodificado = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
        
        // Salva o ID do usuário na requisição para que as rotas seguintes saibam quem ele é
        req.usuarioId = decodificado.id;
        
        next(); // Tudo certo, pode continuar para a rota desejada
    } catch (error) {
        res.status(400).json({ erro: "Token inválido" });
    }
}

// Create dos usuários
app.post('/cadastro', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Gerar o hash da senha (o número 10 é o nível de segurança)
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await prisma.usuario.create({
            data: {
                email,
                senha: senhaCriptografada
            }
        });

        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(400).json({ erro: "E-mail já cadastrado ou dados inválidos" });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Procurar o usuário pelo e-mail
        const usuario = await prisma.usuario.findUnique({
            where: { email: email }
        });

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Comparar a senha digitada com a senha criptografada do banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha incorreta" });
        }

        // Se chegou aqui, a senha está certa! Vamos gerar o Token (Crachá)
        // Guardamos o ID do usuário dentro do token
        const token = jwt.sign(
            { id: usuario.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // O token vale por 1 dia
        );

        res.status(201).json({
            mensagem: "Login realizado com sucesso!",
            token: token
        });

    } catch (error) {
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
});

// Rota para criar novas tarefas (exige login)
app.post('/tarefas', verificarToken, async (req, res) => {
    const { task, description } = req.body;

    const novaTarefa = await prisma.tarefa.create({
        data: {
            task,
            description,
            usuarioId: req.usuarioId // Vincula a tarefa ao usuário logado
        }
    });

    res.json(novaTarefa);
});

// Rota para buscar todas as tarefas apenas do usuário logado
app.get('/tarefas', verificarToken, async (req, res) => {
    try {
        //pegando dia de hoje com a hora atual
        const dia = new Date()
        //subtraindo 24 horas
        dia.setHours(dia.getHours() - 24);

        const tarefas = await prisma.tarefa.findMany({
            where: { usuarioId: req.usuarioId, createdAt: { gte: dia } },// Filtra pelo ID do usuário no token
            orderBy: { createdAt: 'desc' } // Organiza as tarefas pela data de criação em ordem decrescente
        });
        res.json(tarefas);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar tarefas" });
    }
});

// Read dos cadastrados quando quero ver quem esta cadastrado
app.get('/status', async (req, res) => {
    try {
        const cadastros = await prisma.usuario.findMany();
        res.json(cadastros);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar cadastros" });
    }
});

// Read das tarefas de cada usuário
app.get('/tarefas/:id', async (req, res) => {
    const { id } = req.params;

    const tarefas = await prisma.tarefa.findMany({
        where: {
            usuarioId: parseInt(id)
        }
    });

    res.json(tarefas);
});

// Rota para deletar uma tarefa específica do usuário logado
app.delete('/tarefas/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Primeiro, buscamos a tarefa no banco
        const tarefa = await prisma.tarefa.findUnique({
            where: { id: parseInt(id) }
        });

        // Verificamos se a tarefa existe e se pertence ao usuário logado
        if (!tarefa || tarefa.usuarioId !== req.usuarioId) {
            return res.status(403).json({ erro: "Você não tem permissão para deletar esta tarefa" });
        }

        // Se for dono, deleta
        await prisma.tarefa.delete({
            where: { id: parseInt(id) }
        });
        
        res.json({ mensagem: "Tarefa deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar tarefa" });
    }
});

// Rota para atualizar uma tarefa (ex: alternar entre concluída/pendente)
app.put('/tarefas/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { task, description, concluida } = req.body;

        // Verifica se o usuário é dono da tarefa antes de atualizar
        const tarefa = await prisma.tarefa.findUnique({
            where: { id: parseInt(id) }
        });

        if (!tarefa || tarefa.usuarioId !== req.usuarioId) {
            return res.status(403).json({ erro: "Você não tem permissão para alterar esta tarefa" });
        }

        // Atualiza os campos enviados no corpo da requisição
        const tarefaAtualizada = await prisma.tarefa.update({
            where: { id: parseInt(id) },
            data: { task, description, concluida }
        });

        res.json(tarefaAtualizada);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
});

// Rota para editar uma tarefa
app.patch('/alt-tarefas/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { task, description } = req.body;

        // Verifica se o usuário é dono da tarefa antes de atualizar
        const tarefa = await prisma.tarefa.findUnique({
            where: { id: parseInt(id) }
        });

        if (!tarefa || tarefa.usuarioId !== req.usuarioId) {
            return res.status(403).json({ erro: "Você não tem permissão para editar esta tarefa" });
        }

        // Atualiza os campos enviados no corpo da requisição
        const tarefaAtualizada = await prisma.tarefa.update({
            where: { id: parseInt(id) },
            data: { task, description }
        });

        res.json(tarefaAtualizada);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao editar tarefa" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando!"));