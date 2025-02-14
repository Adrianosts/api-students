import { Request, Response } from "express";
import { randomUUID } from "crypto";

import { repository } from "../database/prisma.connection";

export class AuthController {
  public async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Todos os campos são obrigatórios",
        });
      }

      const student = await repository.student.findFirst({
        where: { email, password },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          token: true
        },
      });

      if (!student) {
        return response.status(401).json({
          success: false,
          code: response.statusCode,
          message: "Email ou senha inválidos",
        });
      }

      const token = randomUUID(); // Gerando um token único para o aluno

      await repository.student.update({
        where: { id: student.id },
        data: { token },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Login realizado com sucesso",
        data: {
          ...student,
          token,
        },
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao realizar login",
      });
    }
  }
}
