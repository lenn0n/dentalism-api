import {
  retrieveData,
  updateSingleData
} from "@services/mongo.service"

import type {
  ServiceReturnType,
  MongoParamsType
} from "@definetypes/request.types"

const { ObjectId } = require('mongodb')

export const retrieveProfileService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  const user = await retrieveData({
    collection: "users",
    find: payload.find,
    limit: payload.limit || 100,
    display: { availability: false }
  })

  if (user.length > 0) {
    return {
      code: 200,
      json: {
        list: user
      }
    }
  } else {
    return {
      code: 400,
      json: {
        data: []
      }
    }
  }
}

export const updateProfileService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  const results = await updateSingleData({
    collection: 'users',
    id: payload.id!,
    field: payload.fields!
  })

  if (results.acknowledged) {
    return {
      code: 200,
      json: {
        message: "Profile updated successfully."
      }
    }
  } else {
    return {
      code: 201,
      json: {
        message: "Profile was already updated."
      }
    }
  }
}


export const retrieveDentistService = async (payload: MongoParamsType): Promise<ServiceReturnType> => {
  const dentists = await retrieveData({
    collection: "dentists",
    find: payload.find,
    limit: payload.limit || 100,
    display: { availability: false }
  })

  if (dentists.length > 0) {
    return {
      code: 200,
      json: {
        list: dentists
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

export const getDentistAvailabilityService = async ({ dentist_id, date }: any): Promise<ServiceReturnType> => {
  // GET THE DAY OF THE DATE
  const dateDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  [new Date(String(date)).getDay()]

  // RETURN DENTIST WITH SPECIFIC DAY AVAILABILITY
  const dentist = await retrieveData({
    collection: "dentists",
    find: {
      _id: new ObjectId(dentist_id),
      'availability.day': dateDay
    },
    limit: 1,
    display: { availability: true, _id: false }
  })

  // GET THE APPOINTMENT SCHED FOR THE DAY
  const appointmentSched = await retrieveData({
    collection: 'appointments',
    find: {
      dentist_id: new ObjectId(dentist_id),
      appointment_date: date
    },
    limit: 1000,
    display: { _id: false }
  })

  // FIND AVAILABLE SLOT FOR THE DAY
  let availableSlots: { start_time: number, end_time: number, name: string, value: string }[] = []
  if (dentist.length > 0) {
    let todaySchedule = dentist[0].availability.filter((av: { day: string }) => av.day === dateDay)[0]

    for (let index = todaySchedule.start_time; index < todaySchedule.end_time; index++) {
      if (appointmentSched.length > 0) {
        if (appointmentSched.filter(((as: { start_time: number }) => as.start_time == index)).length === 0) {
          availableSlots.push({
            start_time: index,
            end_time: index + 1,
            name: `${index}:00 - ${index + 1}:00`,
            value: `${index},${index + 1}`
          })
        }
      } else {
        availableSlots.push({
          start_time: index,
          end_time: index + 1,
          name: `${index}:00 - ${index + 1}:00`,
          value: `${index},${index + 1}`
        })
      }
    }
  }
  return {
    code: 200,
    json: {
      date: date,
      day: dateDay,
      list: availableSlots
    }
  }

}