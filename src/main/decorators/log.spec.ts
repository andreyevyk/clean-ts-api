import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { ok, serverError } from '../../presentation/helper/http-helper'
import { LogErrorRepo } from '../../data/protocols/log-error-repo'
import { AccountModel } from '../../domain/models/account'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = ok(makeFakeAccount())
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepo = (): LogErrorRepo => {
  class LogErrorRepoStub implements LogErrorRepo {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepoStub()
}

const makeFakeRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  return httpRequest
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
  logErrorRepoStub: LogErrorRepo
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepoStub = makeLogErrorRepo()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepoStub)
  return {
    sut,
    controllerStub,
    logErrorRepoStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle ', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepoStub } = makeSut()

    const error = makeFakeServerError()
    const logSpy = jest.spyOn(logErrorRepoStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(error)

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
