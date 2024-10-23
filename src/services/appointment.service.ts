import { generateHash } from "@hooks/useJWT";
import {
  retrieveData,
  insertData,
  updateSingleData,
  updateManyData,
  deleteSingleData
} from "@services/mongo.service"

import { retrieveOrCreateUser, sendEmailMessage } from "./auth.service"
import { generateHTMLForBooking } from "@utils/email.template"

import type {
  ServiceReturnType,
  MongoParamsType
} from "@definetypes/request.types"

const { ObjectId } = require('mongodb')

export const retrieveAppointmentService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  
  const appointment = await retrieveData({
    collection: "appointments",
    find: payload.find,
    limit: payload.limit || 100,
    display: { availability: false }
  })

  let dentists = await retrieveData({
    collection: "dentists",
    find: {},
    limit: 1000,
    display: { first_name: true, last_name: true, image: true }
  })

  if (appointment.length > 0) {
    let formattedAppointment: any = []
    appointment.map(async (ap: any) => {
      const dentist = dentists.filter((dentist: any) => String(dentist._id) == ap.dentist_id)
      formattedAppointment.push({
        ...ap,
        start: `${ap.appointment_date} ${String(ap.start_time).length == 1 ? '0' + ap.start_time : ap.start_time}:00:00`,
        end: `${ap.appointment_date} ${String(ap.end_time).length == 1 ? '0' + ap.end_time : ap.end_time}:00:00`,
        title: `Dr. ${dentist[0].first_name}`,
        dentist: dentist[0]
      })
    })

    return {
      code: 200,
      json: {
        list: formattedAppointment
      }
    }
  } else {
    return {
      code: 404,
      json: {
        data: []
      }
    }
  }
}

export const bookAppointmentService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  // CHECK IF SLOT ALREADY TAKEN
  const appointmentSched = await retrieveData({
    collection: 'appointments',
    find: {
      dentist_id: new ObjectId(payload.fields.dentist_id),
      appointment_date: payload.fields.appointment_date,
      start_time: payload.fields.start_time,
      end_time: payload.fields.end_time,
    },
    limit: 1000,
    display: { _id: true }
  })

  if (appointmentSched.length > 0) {
    return {
      code: 409,
      json: {
        message: "The slot time has already been taken."
      }
    }
  }

  // CREATE OR RETRIEVE USER
  const user_id = await retrieveOrCreateUser(payload.fields.email);

  // CREATE APPOINTMENT
  const createAppointment = await insertData({
    collection: 'appointments',
    data: [{ ...payload.fields, user_id: new ObjectId(user_id) }]
  })
  if (createAppointment) {
    const hash = await generateHash(payload.fields.email)

    // INSERT HASH TO DATABASE
    const createHashToDB = await insertData({
      collection: 'hashes',
      data: [{
        hash,
        email: payload.fields.email,
        date: new Date()
      }]
    })
    if (createHashToDB) {
      const loginLink = `${process.env.FRONTEND_CALLBACK_URI}?hash=${hash}`
      const messageStatus = await sendEmailMessage({
        sendTo: payload.fields.email,
        subject: 'Login via Email',
        html: generateHTMLForBooking({ login_link: loginLink }),
      })

      if (!messageStatus) {
        return {
          code: 400,
          json: { message: "There was an error occurred when sending you email." }
        }
      } else {
        return {
          code: 200,
          json: { message: 'The login link was successfully sent to your email address.' }
        }
      }
    } else {
      return {
        code: 409,
        json: {
          message: "An error occured while trying to create appointment. Failed to create hash."
        }
      }
    }
  } else {
    return {
      code: 409,
      json: {
        message: "An error occured while trying to create appointment. Must be taken."
      }
    }
  }
}

export const createAppointmentService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  // CHECK IF SLOT ALREADY TAKEN
  const appointmentSched = await retrieveData({
    collection: 'appointments',
    find: {
      dentist_id: new ObjectId(payload.fields.dentist_id),
      appointment_date: payload.fields.appointment_date,
      start_time: payload.fields.start_time,
      end_time: payload.fields.end_time,
    },
    limit: 1000,
    display: { _id: true }
  })

  if (appointmentSched.length > 0) {
    return {
      code: 409,
      json: {
        message: "The slot time has already been taken."
      }
    }
  }

  // CREATE APPOINTMENT
  const createAppointment = await insertData({
    collection: 'appointments',
    data: [payload.fields]
  })
  if (createAppointment) {
    return {
      code: 200,
      json: {
        message: "Appointment was successfully created."
      }
    }
  } else {
    return {
      code: 409,
      json: {
        message: "An error occured while trying to create appointment. Must be taken."
      }
    }
  }
}
export const updateAppointmentService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  // CHECK IF APPOINTMENT IS OWNED BY REQUESTER
  const appointment = await retrieveData({
    collection: 'appointments',
    find: {
      _id: new ObjectId(payload.id),
      email: payload.token!.email,
      user_id: new ObjectId(payload.token!.user_id)
    },
    limit: 1,
    display: { _id: true }
  })

  if (appointment.length === 0) {
    return {
      code: 401,
      json: {
        status: 401,
        message: "This is not your appointment."
      }
    }
  }

  // UPDATE APPOINTMENT DETAILS
  const results = await updateSingleData({
    collection: 'appointments',
    id: payload.id!,
    field: payload.fields
  })

  if (results.acknowledged) {
    return {
      code: 200,
      json: {
        status: 200,
        message: "Appointment was successfully updated."
      }
    }
  } else {
    return {
      code: 400,
      json: {
        status: 400,
        message: "An error was occurred."
      }
    }
  }

}
export const cancelAppointmentService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  // CHECK IF APPOINTMENT IS OWNED BY REQUESTER
  const appointment = await retrieveData({
    collection: 'appointments',
    find: {
      _id: new ObjectId(payload.id),
      email: payload.token!.email,
      user_id: new ObjectId(payload.token!.user_id)
    },
    limit: 1,
    display: { _id: true }
  })

  if (appointment.length === 0) {
    return {
      code: 401,
      json: {
        message: "This is not your appointment."
      }
    }
  }

  // REMOVE THE APPOINTMENT
  const results = await deleteSingleData({
    collection: 'appointments',
    id: new ObjectId(payload.id),
  })
  console.log(results);

  if (results.acknowledged && results.deletedCount) {
    return {
      code: 200,
      json: {
        message: "Appointment was successfully cancelled."
      }
    }
  } else {
    return {
      code: 401,
      json: {
        message: "The appointment is no longer exists."
      }
    }
  }
}