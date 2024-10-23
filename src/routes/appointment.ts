import { Router } from "express";
import { validateToken } from "@routes/middleware";
import {
  bookAppointment,
  cancelAppointment,
  createAppointment,
  retrieveAppointment,
  updateAppointment
} from "@controllers/appointment.controller";

const router = Router();

router.post("/book-appointment", bookAppointment)
router.get("/appointment", validateToken, retrieveAppointment)
router.post("/appointment", validateToken, createAppointment)
router.put("/appointment", validateToken, updateAppointment)
router.delete("/appointment", validateToken, cancelAppointment)

export default router;