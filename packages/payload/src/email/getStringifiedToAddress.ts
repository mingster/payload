import type { SendMailOptions } from 'nodemailer'

export const getStringifiedToAddress = (message: SendMailOptions): string | undefined => {
  let stringifiedTo: string | undefined

  if (typeof message.to === 'string') {
    stringifiedTo = message.to
  } else if (Array.isArray(message.to)) {
    stringifiedTo = message.to
      .map((to) => {
        if (typeof to === 'string') {
          return to
        } else if (to.address) {
          return to.address
        }
        return ''
      })
      .join(', ')
  } else if (message.to.address) {
    stringifiedTo = message.to.address
  }
  return stringifiedTo
}
