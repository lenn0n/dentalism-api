import { Request, Response } from "express";
import { 
  retrieveProfileService, 
  updateProfileService,
  retrieveDentistService,
  getDentistAvailabilityService,
} from "@services/user.service";
const { ObjectId } = require('mongodb')

const retrieveProfile = async (req: Request, res: Response) => {
  let payload: any = {};

  if (req.query.email){
    payload['find'] = { email: req.query.email }
  }

  const results = await retrieveProfileService(payload)
  return res.status(results.code).json(results.json);
}

const updateProfile = async (req: Request, res: Response) => {
  let payload: any = {};

  const id = req.body.id as string;
  const fields = req.body.fields as string | {};

  if (!id) return res.status(400).json({ message: "Please provide user ID." });
  else payload['id'] = req.body.id
  
  if (!fields) return res.status(400).json({ message: "Please provide user ID." });
  else payload['fields'] = req.body.fields 

  const results = await updateProfileService(payload)
  return res.status(results.code).json(results.json);
}

const retrieveDentist = async (req: Request, res: Response) => {
  let payload: any = {};

  if (req.query.find){
    payload['find'] = req.query.find
  }

  const results = await retrieveDentistService(payload)
  return res.status(results.code).json(results.json);
}

const getDentistAvailability = async (req: Request, res: Response) => {
  // Check if email payload is provided
  const dentist_id = req.query.dentist_id as string;
  if (!dentist_id) {
    return res.status(404).json({ message: "Please provide a dentist." });
  }

  try {
    new ObjectId(dentist_id)
  } catch (error) {
    return res.status(403).json({ message: "Invalid dentist." });
  }

  const date = req.query.date as string;
  if (!date) {
    return res.status(404).json({ message: "Please provide a date" });
  }

  const results = await getDentistAvailabilityService({ dentist_id, date })
  return res.status(results.code).json(results.json);
}


export {
  retrieveProfile,
  updateProfile,
  retrieveDentist,
  getDentistAvailability
}