import { Request, Response } from "express";

import { repository } from "../database/prisma.connection";
import { Student } from "../models/student.model";

export class StudentController {
  // index -> lista todos os registros
  public async index(request: Request, response: Response) {
    try {
      // processamento
      const students = await repository.student.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
        },
      });

      //saída
      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Alunos listados com sucesso",
        data: students,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao listar alunos",
      });
    }
  }

  // store -> criar um novo registro
  public async store(request: Request, response: Response) {
    try {
      // entrada > recebido lá do corpo da requisição
      const { name, email, password, age } = request.body;

      // processamento
      // Validações
      // Existência do email
      const existingEmail = await repository.student.findFirst({
        where: { email },
      });

      if (existingEmail) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Email já cadastrado",
        });
      }

      if (!name || !email || !password || !age) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Todos os campos são obrigatórios",
        });
      }

      const newStudent = new Student(name, email, password, age);

      // Se der tudo certo, salvar nessa variável.
      const createdStudent = await repository.student.create({
        data: {
          id: newStudent.id,
          name: newStudent.name,
          email: newStudent.email,
          password: newStudent.password,
          age: newStudent.age,
        },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
        },
      });

      // saída
      return response.status(201).json({
        success: true,
        code: response.statusCode,
        message: "Aluno cadastrado com sucesso",
        data: createdStudent,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao cadastrar aluno",
      });
    }
  }

  // show -> detalhes de um único registro
  public async show(request: Request, response: Response) {
    try {
      // entrada > recebido lá do parâmetro da requisição
      const { id } = request.params;

      // processamento
      const student = await repository.student.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
        },
      });

      // saída
      if (!student) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Aluno não encontrado",
        });
      }

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Aluno encontrado com sucesso!",
        data: student,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao encoontrar aluno",
      });
    }
  }

  // update -> atualizar um registro
  public async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name, email, password, age } = request.body;

      if (!id || !name || !email || !password) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Todos os campos são obrigatórios",
        });
      }

      const updatedStudent = await repository.student.update({
        where: { id },
        data: {
          name,
          email,
          password,
          age,
        },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
        },
      });

      if (!updatedStudent) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Aluno não encontrado",
        });
      }

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Aluno atualizado com sucesso!",
        data: updatedStudent,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao atualizar aluno",
      });
    }
  }

  // delete ou destroy -> remover um registro existente
  public async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const student = await repository.student.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
        },
      });

      if (!student) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Aluno não encontrado",
        });
      }

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Aluno deletado com sucesso!",
        data: student,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao deletar aluno",
      });
    }
  }
}
