import express from "express";
import cors from "cors";
import * as dotenv from 'dotenv';  // imprtando a variável de ambiente

import authRoutes from './routes/auth.routes'
import studentRoutes from './routes/students.routes'

const app = express();

dotenv.config(); // Configuração da variável de ambiente 

app.use(express.json());
app.use(cors());

app.use(authRoutes)
app.use(studentRoutes)

// usando a variável de ambiente -> process.env.PORT
app.listen(process.env.PORT, () => {
  console.log("🚀 Server ready at: http://localhost:3000");
});

// Pra instalar a variável de ambiente -> npm install dotenv.
// Para deixar o Render mais livre para escolher a PORTA que ele quiser.