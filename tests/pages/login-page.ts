import { Page } from '@playwright/test'
import { SERVICE_URL } from '../../config/env-data'
import { OrderPage } from './order-page'

export class LoginPage {
  readonly page: Page
  readonly url: string = SERVICE_URL
  readonly usernameField
  readonly passwordField
  readonly signIn
  readonly authorizationError

  constructor(page: Page) {
    this.page = page
    this.usernameField = page.getByTestId('username-input')
    this.passwordField = page.getByTestId('password-input')
    this.signIn = page.getByTestId('signIn-button')
    this.authorizationError = page.getByTestId('authorizationError-popup')
  }

  async open() {
    await this.page.goto(this.url)
  }

  async authorize(userName: string, password: string) {
    await this.usernameField.fill(userName)
    await this.passwordField.fill(password)
    await this.signIn.click()
    return new OrderPage(this.page)
  }
}
