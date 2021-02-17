import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepo } from '../../data/protocols/log-error-repo'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepo: LogErrorRepo

  constructor (controller: Controller, logErrorRepo: LogErrorRepo) {
    this.controller = controller
    this.logErrorRepo = logErrorRepo
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepo.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}
