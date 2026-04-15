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

        // 1. Procurar o usuário pelo e-mail
        const usuario = await prisma.usuario.findUnique({
            where: { email: email }
        });

        // 2. Se o usuário não existir, para aqui
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // 3. Comparar a senha digitada com a senha criptografada do banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha incorreta" });
        }

        // 4. Se chegou aqui, a senha está certa! Vamos gerar o Token (Crachá)
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

// Read
app.get('/status', async (req, res) => {
    try {
        const cadastros = await prisma.usuario.findMany();
        res.json(cadastros);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar cadastros" });
    }
});

//delete
app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await prisma.usuario.delete({
            where: { id: parseInt(id) }
        });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar usuário" });
    }
});


app.listen(3000, () => console.log("🚀 Server rodando na porta 3000"));