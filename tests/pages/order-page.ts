import { expect, Page } from '@playwright/test'
import { Locator } from 'playwright-core'
import { LoginPage } from './login-page'

export class OrderPage {
  readonly page: Page
  readonly statusButton
  readonly phone: Locator
  readonly comment: Locator
  readonly createOrderButton: Locator
  readonly orderCreatedOkButton: Locator
  readonly searchOrderInput: Locator
  readonly searchOrderSubmitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.phone = page.getByTestId('phone-input')
    this.comment = page.getByTestId('comment-input')
    this.createOrderButton = page.getByTestId('createOrder-button')
    this.orderCreatedOkButton = page.getByTestId('orderSuccessfullyCreated-popup-ok-button')
    this.searchOrderInput = page.getByTestId('searchOrder-input')
    this.searchOrderSubmitButton = page.getByTestId('searchOrder-submitButton')
  }

  async orderCreate(userName: string, phone: string, comment: string) {
    const loginPage = new LoginPage(this.page)
    await expect(this.statusButton).toBeVisible()
    await loginPage.usernameField.click()
    await loginPage.usernameField.fill(userName)
    await loginPage.usernameField.press('Tab')
    await this.phone.click()
    await this.phone.fill(phone)
    await this.comment.click()
    await this.comment.fill(comment)
    await this.createOrderButton.click()
    await expect(this.orderCreatedOkButton).toBeVisible()

    return new OrderPage(this.page)
  }

  async searchOrder(orderNumber: string) {
    await this.statusButton.click()
    await this.searchOrderInput.click()
    await this.searchOrderInput.fill(orderNumber)
    await this.searchOrderSubmitButton.click()
  }
}
