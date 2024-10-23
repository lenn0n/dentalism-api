export type ServiceReturnType = {
  code: number,
  json: {}
}

export type MongoParamsType = {
  id?: string,
  collection?: string,
  find?: {},
  limit?: number,
  page?: number,
  sort?: any,
  display?: {},
  retrieveFirstAvailability?: boolean,
  fields?: any,
  token?: JWTPayload
}

export type JWTType = {
  payload: any,
  options?: {
    expiresIn: string
  }
}

export type JWTPayload = {
  email?: string,
  user_id?: string
}