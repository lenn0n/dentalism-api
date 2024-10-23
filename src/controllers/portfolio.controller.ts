import { Request, Response } from "express";
import {
  retrieveData,
  insertData,
  updateSingleData,
  updateManyData,
  deleteSingleData
} from "@services/mongo.service"

interface sortInterface {
  sortBy?: string,
  sortOrder?: number
}

interface dbPayloadInterface {
  collection?: string,
  find?: string,
  sort?: sortInterface,
  page?: number,
  limit?: number
}

export const getData = async (req: Request, res: Response) => {
  let sortPayload: sortInterface = {}, dbPayload: dbPayloadInterface = {}

  if (req.query.sortBy) {
    sortPayload = { [String(req.query.sortBy)]: req.query.sortOrder == 'desc' ? -1 : 1 }
  }

  dbPayload = {
    collection: req.query.collection as string,
    find: req.query.find as string,
    sort: sortPayload,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10)
  }

  const data = await retrieveData(dbPayload)
  if (data) {
    return res.status(200).json(data)
  } else {
    return res.status(404)
  }
}

export const addData = async (req: Request, res: Response) => {
  const { collection, data } = req.body;
  let dataToArray: any[] = []

  if (!collection) {
    return res.status(403).json({ message: 'Missing collection field.' })
  }

  if (!data) {
    return res.status(403).json({ message: 'Missing data field.' })
  }

  if (!Array.isArray(data)) {
    dataToArray = [data]
  }

  const results = await insertData({
    collection,
    data: dataToArray.length > 0 ? dataToArray : data
  })

  if (results) {
    return res.status(200).json({ message: 'Tech stack has been added successfully.', trace: results })
  } else {
    return res.status(404).json({ message: 'An error occured while trying to add data.', trace: results  })
  }
}


export const editSingleData = async (req: Request, res: Response) => {
  const { collection, row } = req.body;

  if (!collection) {
    return res.status(403).json({ message: 'Missing collection field.' })
  }
  if (!req.params.id) {
    return res.status(403).json({ message: 'Missing id field.' })
  }
  if (!row) {
    return res.status(403).json({ message: 'Missing row field.' })
  }

  const results = await updateSingleData({
    collection: collection,
    id: req.params.id,
    field: row
  })

  if (results.acknowledged) {
    return res.status(200).json({ message: 'Single row has been updated successfully.', trace: results})
  } else {
    return res.status(404).json({ message: 'An error occured while trying to update single data.', trace: results })
  }
}


export const editManyData = async (req: Request, res: Response) => {
  const { collection, row, query } = req.body;

  if (!collection) {
    return res.status(403).json({ message: 'Missing collection field.' })
  }
  if (!row) {
    return res.status(403).json({ message: 'Missing row field.' })
  }
  if (!query) {
    return res.status(403).json({ message: 'Missing query field.' })
  }

  const results = await updateManyData({
    collection: collection,
    field: row,
    query,
  })

  if (results.acknowledged) {
    return res.status(200).json({ message: 'Bulk rows have been updated successfully.', trace: results})
  } else {
    return res.status(404).json({ message: 'An error occured while trying to update single data.', trace: results  })
  }
}

export const removeSingleData = async (req: Request, res: Response) => {
  const { collection, id } = req.query;

  const results = await deleteSingleData({
    collection: collection as string,
    id: id as string
  })

  if (results.acknowledged && results.modifiedCount) {
    return res.status(200).json('Document was successfully removed.')
  } else {
    return res.status(404)
  }
}
