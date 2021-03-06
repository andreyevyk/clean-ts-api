import { SignupController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepo } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepo } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const salt = 12
  const encrypter = new BcryptAdapter(salt)

  const logMongoRepo = new LogMongoRepo()
  const accountMongoRepo = new AccountMongoRepo()
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepo)

  const signupController = new SignupController(emailValidatorAdapter, dbAddAccount)

  return new LogControllerDecorator(signupController, logMongoRepo)
}
