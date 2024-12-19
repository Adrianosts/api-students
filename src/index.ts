import express from "express";
import cors from "cors";

import authRoutes from './routes/auth.routes'
import studentRoutes from './routes/students.routes'

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRoutes)
app.use(studentRoutes)

app.listen(3000, () => {
  console.log("🚀 Server ready at: http://localhost:3000");
});

