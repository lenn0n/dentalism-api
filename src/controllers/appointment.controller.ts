import { Request, Response } from "express";
import { decodeTokenFromRequest } from "@hooks/useJWT";
import {
  bookAppointmentService,
  retrieveAppointmentService,
  createAppointmentService,
  updateAppointmentService,
  cancelAppointmentService
} from "@services/appointment.service";
import { JWTPayload } from "@definetypes/request.types";

const { ObjectId } = require('mongodb')

const retrieveAppointment = async (req: Request, res: Response) => {
  let payload: any = {};
  let token = decodeTokenFromRequest(req)

  // INCLUDE REQUEST HEADERS
  if (token) {
    payload = { ...payload, find: { email: token?.email } }
  }

  // Filter by dentist
  if (req.query.dentist_id) {
    payload['find'] = {
      ...payload.find,
      dentist_id: req.query.dentist_id
    }
  }

  // Filter by date
  if (req.query.appointment_date) {
    payload['find'] = {
      ...payload.find,
      appointment_date: req.query.appointment_date,
    }
  }
  
  const results = await retrieveAppointmentService(payload)
  return res.status(results.code).json(results.json);
}


const bookAppointment = async (req: Request, res: Response) => {
  let payload: any = {
    fields: {}
  };

  // DESTRUCTURE REQUEST BODY
  const { dentist_id, appointment_date, start_time, end_time, notes, email } = req.body

  // INCLUDE EMAIL
  if (!email) {
    return res.status(400).json({ message: "Please provide email address." });
  } else payload['fields']['email'] = email

  // VALIDATE DENTIST
  try {
    if (!dentist_id) {
      return res.status(400).json({ message: "Please provide dentist." });
    } else payload['fields']['dentist_id'] = new ObjectId(dentist_id)
  } catch (error) {
    return res.status(400).json({ message: "Please provide a valid dentist." });
  }

   // INCLUDE DATE
   if (!appointment_date) {
    return res.status(400).json({ message: "Please provide a date." });
  } else payload['fields']['appointment_date'] = appointment_date

  // INCLUDE START TIME
  if (!start_time) {
    return res.status(400).json({ message: "Please provide a start time." });
  } else payload['fields']['start_time'] = start_time

  // INCLUDE END TIME
  if (!end_time) {
    return res.status(400).json({ message: "Please provide a end time." });
  } else payload['fields']['end_time'] = end_time


  // VALIDATE START AND END TIME
  if (start_time >= end_time) {
    return res.status(400).json({ message: "Please provide a valid appointment time." });
  }

  // OPTIONALLY ADD NOTES IF SPECIFIED
  if (notes) {
    payload['fields']['notes'] = notes
  }

  const results = await bookAppointmentService(payload)
  return res.status(results.code).json(results.json);
}

const createAppointment = async (req: Request, res: Response) => {
  let payload: any = {
    fields: {}
  };
  let token: JWTPayload = decodeTokenFromRequest(req)

  // INCLUDE REQUEST HEADERS
  if (token) {
    payload['fields'] = {
      ...payload.fields,
      email: token.email,
      user_id: new ObjectId(token.user_id)
    }
  }

  // DESTRUCTURE REQUEST BODY
  const { dentist_id, appointment_date, start_time, end_time, notes } = req.body

  // VALIDATE DENTIST
  try {
    if (!dentist_id) {
      return res.status(400).json({ message: "Please provide dentist." });
    } else payload['fields']['dentist_id'] = new ObjectId(dentist_id)

  } catch (error) {
    return res.status(400).json({ message: "Please provide a valid dentist." });
  }

  // INCLUDE DATE
  if (!appointment_date) {
    return res.status(400).json({ message: "Please provide a date." });
  } else payload['fields']['appointment_date'] = appointment_date

  // INCLUDE START TIME
  if (!start_time) {
    return res.status(400).json({ message: "Please provide a start time." });
  } else payload['fields']['start_time'] = start_time

  // INCLUDE END TIME
  if (!end_time) {
    return res.status(400).json({ message: "Please provide a end time." });
  } else payload['fields']['end_time'] = end_time


  // VALIDATE START AND END TIME
  if (start_time >= end_time) {
    return res.status(400).json({ message: "Please provide a valid appointment time." });
  }

  // OPTIONALLY ADD NOTES IF SPECIFIED
  if (notes) {
    payload['fields']['notes'] = notes
  }

  const results = await createAppointmentService(payload)
  return res.status(results.code).json(results.json);
}

const updateAppointment = async (req: Request, res: Response) => {
  let payload: any = {};
  let token = decodeTokenFromRequest(req)

  // INCLUDE REQUEST HEADERS
  if (token) {
    payload = { ...payload, token }
  }
  const { id, fields } = req.body;

  // VALIDATE APPOINTMENT ID
  try {
    if (!id) {
      return res.status(400).json({ message: "Please provide a appointment id." });
    } else {
      new ObjectId(id)
      payload = { ...payload, id }
    }
  } catch (error) {
    return res.status(400).json({ message: "Please provide a valid ID of appointment." });
  }

  // INCLUDE FIELDS
  if (!fields) {
    return res.status(400).json({ message: "Please provide a fields." });
  } else payload['fields'] = fields


  const results = await updateAppointmentService(payload)
  return res.status(results.code).json(results.json);
}

const cancelAppointment = async (req: Request, res: Response) => {
  let payload: any = {};
  let token = decodeTokenFromRequest(req)

  // INCLUDE REQUEST HEADERS
  if (token) {
    payload = { ...payload, token }
  }
  const { id } = req.body;

  // VALIDATE APPOINTMENT ID
  try {
    if (!id) {
      return res.status(400).json({ message: "Please provide a appointment id." });
    } else {
      new ObjectId(id)
      payload = { ...payload, id }
    }
  } catch (error) {
    return res.status(400).json({ message: "Please provide a valid ID of appointment." });
  }

  const results = await cancelAppointmentService(payload)
  return res.status(results.code).json(results.json);
}

export {
  bookAppointment,
  retrieveAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment
}