export const loginWithoutEmail = {
  password: 'secret_user'
}

export const loginWithoutPassword = {
  email: 'user@user.com'
}

export const loginWithInvalidEmail = {
  email: '@user.com',
  password: 'secret_user'
}

export const loginWithInvalidPassword = {
  email: 'use@user.com',
  password: '123'
}

export const loginWithIncorrectEmail = {
  email: 'incorrect@email.com',
  password : 'secret'
}

export const loginWithIncorrectPassword = {
  email: 'user@user.com',
  password : 'as'
}

export const loginWithDataCorrect = {
  username: 'User',
  role: 'user',
  email: 'user@user.com',
  password: 'secret_user'
}