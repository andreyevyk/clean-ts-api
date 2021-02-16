import { SignupController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepo } from '../../infra/db/mongodb/account-repostitory/account'

export const makeSignUpController = (): SignupController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const salt = 12
  const encrypter = new BcryptAdapter(salt)

  const accountMongoRepo = new AccountMongoRepo()
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepo)

  return new SignupController(emailValidatorAdapter, dbAddAccount)
}
