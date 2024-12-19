import { Request, Response } from "express";
import { repository } from "../database/prisma.connection";
import { Assessment } from "../models/assessment.model";

export class AssessmentController {
  // Métodos para listar todas as avaliações
  public async index(request: Request, response: Response) {
    try {
      const { studentId } = request.params;

      // Implementar a consulta para listar as avaliações do aluno com o ID fornecido
      const student = await repository.student.findUnique({
        where: { id: studentId },
        include: {
          assessment: {
            select: {
              id: true,
              discipline: true,
              grade: true,
            },
          },
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
        message: "Avaliações do aluno listadas com sucesso!",
        data: student.assessment,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao listar avaliações",
      });
    }
  }

  // Métodos para cadastrar uma nova avaliação
  public async store(request: Request, response: Response) {
    try {
      const { studentId } = request.params;
      const { discipline, grade } = request.body;
      const { authorization } = request.headers;

      if (!discipline || !grade) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Todos os campos são obrigatórios",
        });
      }

      if (!authorization) {
        return response.status(401).json({
          success: false,
          code: response.statusCode,
          message: "Token de autenticação não fornecido",
        });
      }

      const student = await repository.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Aluno não encontrado",
        });
      }

      // Verificação para saber se os token são iguais
      if(student.token !== authorization) {
        return response.status(403).json({
          success: false,
          code: response.statusCode,
          message: "Token de autenticação inválido",
        });
      }

      const newAssessment = new Assessment(discipline, grade, studentId);

      const createdAssessment = await repository.assessment.create({
        data: {
          id: newAssessment.id,
          discipline: newAssessment.discipline,
          grade: newAssessment.grade,
          studentId: newAssessment.studentId,
        },
        select: {
          id: true,
          discipline: true,
          grade: true,
        },
      });

      return response.status(201).json({
        success: true,
        code: response.statusCode,
        message: "Avaliação criada com sucesso!",
        data: createdAssessment,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao cadastrar avaliação",
      });
    }
  }

  // show -> detalhes de uma única avaliação
  public async show(request: Request, response: Response) {
    try {
      const { studentId, id } = request.params; // id da avaliação e id do estudante
      const assessment = await repository.assessment.findUnique({
        where: { id, studentId },
        select: {
          id: true,
          discipline: true,
          grade: true,
        },
      });

      if (!assessment) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Avaliação não encontrada",
        });
      }

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Detalhes da avaliação",
        data: assessment,
      });
    } catch (error) {}
  }

  // update -> atualizar uma avaliação
  public async update(request: Request, response: Response) {
    try {
      const { studentId, id } = request.params;
      const { discipline, grade } = request.body;

      if (!discipline || !grade) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Todos os campos são obrigatórios",
        });
      }

      const assessment = await repository.assessment.findUnique({
        where: { id, studentId },
      });

      if (!assessment) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Avaliação não encontrada",
        });
      }

      const updateAssessmet = await repository.assessment.update({
        where: { id, studentId },
        data: { discipline, grade },
        select: { discipline: true, grade: true },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Avaliação atualizada com sucesso!",
        data: updateAssessmet,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao atualizar avaliação",
      });
    }
  }

  // delete ou destroy -> deletar uma avaliação
  public async delete(request: Request, response: Response) {
    try {
      const { studentId, id } = request.params;

      const assessment = await repository.assessment.findUnique({
        where: { id },
      });

      if (!assessment) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Avaliação não encontrada",
        });
      }

      const deleteAssessment = await repository.assessment.delete({
        where: { id },
        select: {
          id: true,
          discipline: true,
          grade: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Avaliação deletada com sucesso!",
        data: deleteAssessment,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao deletar avaliação",
      });
    }
  }
}
