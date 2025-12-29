import { expect, test } from '@playwright/test'
import { SERVICE_URL } from '../../../config/env-data'
import { fakeJwt } from '../../utils/jwt-generator'
import { LoginPage } from '../../pages/login-page'
import { OrderPage } from '../../pages/order-page'


test('Sign in flow with mock', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const jwt = fakeJwt()

  await page.route('**/login/student', async (route) => {
    await route.fulfill({
      // body not a json but a plain text
      body: jwt,
      status: 200,
    })
  })

  await page.goto(SERVICE_URL)
  await loginPage.authorize('12345678','qwertyui');
  await expect(page.getByTestId('openStatusPopup-button')).toBeVisible()
})

test('Sign in flow with negative mock', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.route('**/login/student', async (route) => {
    await route.fulfill({
      status: 401,
    })
  })
  await page.goto(SERVICE_URL)
  await loginPage.authorize('12345678','qwertyui');
  await expect(loginPage.authorizationError).toBeVisible()
})

test('Sign in flow and create an order with mock', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const orderPage = new OrderPage(page);
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
  await loginPage.authorize('12345678','qwertyui');
  await expect(page.getByTestId('openStatusPopup-button')).toBeVisible()
  await orderPage.orderCreate('moh','3321312','123')
});



test('Sign in flow and get order by id with mock', async ({ page }) => {
  const jwt = fakeJwt()
  const loginPage = new LoginPage(page);
  const orderPage = new OrderPage(page);
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
  await loginPage.authorize('12345678','qwertyui');
 await orderPage.searchOrder('888');
   });


test('Sign in flow and get accepted order by id with mock', async ({ page }) => {
  const jwt = fakeJwt()
  const loginPage = new LoginPage(page);
  const orderPage = new OrderPage(page);
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
  await loginPage.authorize('12345678','qwertyui');
 await orderPage.searchOrder('888');
});
