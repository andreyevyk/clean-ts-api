import { NextFunction, Response } from 'express'

export const cors = (_, res: Response, next: NextFunction): void => {
  res.set('access-controll-allow-origin', '*')
  res.set('access-controll-allow-headers', '*')
  res.set('access-controll-allow-methods', '*')
  next()
}
