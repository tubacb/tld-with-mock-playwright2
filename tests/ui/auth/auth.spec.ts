import { expect, test } from '@playwright/test'
import { SERVICE_URL } from '../../../config/env-data'
import { fakeJwt } from '../../utils/jwt-generator'

test('Sign in flow with mock', async ({ page }) => {
  const jwt = fakeJwt()

  await page.route('**/login/student', async (route) => {
    await route.fulfill({
      // body not a json but a plain text
      body: jwt,
      status: 200,
    })
  })

  await page.goto(SERVICE_URL)
  const usernameField = page.getByTestId('username-input')
  await usernameField.fill('12345678')
  const passwordField = page.getByTestId('password-input')
  await passwordField.fill('qwertyui')
  const signInButton = page.getByTestId('signIn-button')
  await signInButton.click()
  await expect(page.getByTestId('openStatusPopup-button')).toBeVisible()
})

test('Sign in flow with negative mock', async ({ page }) => {
  await page.route('**/login/student', async (route) => {
    await route.fulfill({
      status: 401,
    })
  })

  await page.goto(SERVICE_URL)
  const usernameField = page.getByTestId('username-input')
  await usernameField.fill('12345678')
  const passwordField = page.getByTestId('password-input')
  await passwordField.fill('qwertyui')
  const signInButton = page.getByTestId('signIn-button')
  await signInButton.click()
  await expect(page.getByTestId('authorizationError-popup')).toBeVisible()
})

test('Sign in flow and create an order with mock', async ({ page }) => {
  const jwt = fakeJwt()

  await page.route('**/login/student', async (route) => {
    await route.fulfill({
      // body not a json but a plain text
      body: jwt,
      status: 200,
    })
  })

  const orderResponse = {
    status: 'OPEN',
    courierId: null,
    customerName: 'Firstorder',
    customerPhone: '5555551111',
    comment: '32',
    id: 13993,
  }

  await page.route('**/orders', async (route) => {
    await route.fulfill({
      json: orderResponse,
      status: 200,
    })
  })

  await page.goto(SERVICE_URL)
  const usernameField = page.getByTestId('username-input')
  await usernameField.fill('12345678')
  const passwordField = page.getByTestId('password-input')
  await passwordField.fill('qwertyui')
  const signInButton = page.getByTestId('signIn-button')
  await signInButton.click()
  await expect(page.getByTestId('openStatusPopup-button')).toBeVisible()
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('moh');
  await page.getByTestId('username-input').press('Tab');
  await page.getByTestId('phone-input').fill('33213');
  await page.getByTestId('comment-input').click();
  await page.getByTestId('comment-input').fill('123');
  await page.locator('div').nth(1).click();
  await page.getByTestId('phone-input').click();
  await page.getByTestId('phone-input').fill('3321312');
  await page.getByTestId('createOrder-button').click();
  await expect (page.getByTestId('orderSuccessfullyCreated-popup-ok-button')).toBeVisible();
});



test('Sign in flow and get order by id with mock', async ({ page }) => {
  const jwt = fakeJwt()

  await page.route('**/login/student', async (route) => {
    await route.fulfill({
      // body not a json but a plain text
      body: jwt,
      status: 200,
    })
  })

  const orderResponse = {
    status: 'OPEN',
    courierId: null,
    customerName: 'Get mock order',
    customerPhone: '5555551111',
    comment: '32',
    id: 888,
  }

  await page.route('**/orders/888', async (route) => {
    await route.fulfill({
      json: orderResponse,
      status: 200,
    })
  })

  await page.goto(SERVICE_URL)
  const usernameField = page.getByTestId('username-input')
  await usernameField.fill('12345678')
  const passwordField = page.getByTestId('password-input')
  await passwordField.fill('qwertyui')
  const signInButton = page.getByTestId('signIn-button')
  await signInButton.click()
  await page.getByTestId('openStatusPopup-button').click();
  await page.getByTestId('searchOrder-input').click();
  await page.getByTestId('searchOrder-input').fill('888');
  await page.getByTestId('searchOrder-submitButton').click();
 });


test.only('Sign in flow and get accepted order by id with mock', async ({ page }) => {
  const jwt = fakeJwt()

  await page.route('**/login/student', async (route) => {
    await route.fulfill({
      // body not a json but a plain text
      body: jwt,
      status: 200,
    })
  })

  const orderResponse = {
    status: 'ACCEPTED',
    courierId: null,
    customerName: 'Get ACCEPTED order',
    customerPhone: '5555551111',
    comment: '32',
    id: 888,
  }

  await page.route('**/orders/888', async (route) => {
    await route.fulfill({
      json: orderResponse,
      status: 200,
    })
  })

  await page.goto(SERVICE_URL)
  const usernameField = page.getByTestId('username-input')
  await usernameField.fill('12345678')
  const passwordField = page.getByTestId('password-input')
  await passwordField.fill('qwertyui')
  const signInButton = page.getByTestId('signIn-button')
  await signInButton.click()
  await page.getByTestId('openStatusPopup-button').click();
  await page.getByTestId('searchOrder-input').click();
  await page.getByTestId('searchOrder-input').fill('888');
  await page.getByTestId('searchOrder-submitButton').click();
});
