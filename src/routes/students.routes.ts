import express from "express";

import { StudentController } from "../controllers/student.controller";
import { AssessmentController } from "../controllers/assessment.controller";
import { validateToken } from "../middleware/auth.middleware";

const studentController = new StudentController();
const assessmentController = new AssessmentController();

const router = express.Router();

router.get("/students", studentController.index);

router.post("/students", studentController.store);

router.get("/students/:id", studentController.show);

router.put("/students/:id", studentController.update);

router.delete("/students/:id", studentController.delete);

// Listar avaliações
router.get("/student/:studentId/assessment", validateToken, assessmentController.index);

// Cadastrar nova avaliação
router.post("/student/:studentId/assessment", validateToken, assessmentController.store);

// Listar uma avaliação
router.get("/student/:studentId/assessment/:id", validateToken, assessmentController.show)

// Atualizar uma avaliação
router.put("/student/:studentId/assessment/:id", validateToken, assessmentController.update)

// Deletar uma avaliação
router.delete("/student/:studentId/assessment/:id", validateToken, assessmentController.delete)



export default router;