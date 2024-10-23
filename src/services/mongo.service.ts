const { mongoDB } = require("@mongodb")
const { ObjectId } = require('mongodb')
import type { MongoParamsType } from "@definetypes/request.types"

const retrieveData = (data: MongoParamsType) => {
  const { collection, find, sort, page, limit, display } = data

  return mongoDB()
    .collection(collection)
    .find(find, { projection: display })
    .sort(sort)
    .skip((page! - 1) * limit!)
    .limit(limit)
    .toArray()
    .then((data: any) => {
      return data
    })
    .catch((err: null) => {
      return []
    })
}


const insertData = ({ collection, data }: { collection: string, data: any[] }) => {
  return mongoDB()
    .collection(collection)
    .insertMany(data)
    .then((data: any) => {
      return data
    })
    .catch((err: null) => {
      return []
    })
}

const updateSingleData = ({ collection, id, field }: { collection: string, id: string, field: {} }) => {
  return mongoDB()
    .collection(collection)
    .updateOne({ _id: new ObjectId(id) }, { $set: field })
    .then((data: any) => {
      return data
    })
    .catch((err: null) => {
      return []
    })
}

const updateManyData = ({ collection, query, field }: { collection: string, query: {}, field: [] }) => {
  return mongoDB()
    .collection(collection)
    .updateMany(query, { $set: field })
    .then((data: any) => {
      return data
    })
    .catch((err: null) => {
      return []
    })
}

const deleteSingleData = ({ collection, id }: { collection: string, id: string }) => {
  return mongoDB()
    .collection(collection)
    .deleteOne({ _id: new ObjectId(id) })
    .then((data: any) => {
      return data
    })
    .catch((err: null) => {
      return []
    })
}

const deleteManyData = ({ collection, query }: { collection: string, query: {} }) => {
  return mongoDB()
    .collection(collection)
    .deleteMany(query)
    .then((data: any) => {
      return data
    })
    .catch((err: null) => {
      return []
    })
}


export {
  retrieveData,
  insertData,
  updateSingleData,
  updateManyData,
  deleteSingleData,
  deleteManyData
}