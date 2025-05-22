import { regions } from '@/config/regions'

import libphonenumber from 'google-libphonenumber'

export function findMobilePrefix(code?: string) {
  const find = regions?.find(v => v.countryCode === code)
  return find?.mobilePrefix
}

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
const PNF = libphonenumber.PhoneNumberFormat

export function parsePhone(
  phone = '',
  country?: string,
  prefix?: string,
) {
  if (phone.length <= 1 || !country || !prefix)
    return { show: phone, verify: false, value: '' }

  try {
    const phoneNumber = phoneUtil.parseAndKeepRawInput(phone, country)
    const verify = phoneUtil.isValidNumber(phoneNumber)
    const value = phoneUtil.format(phoneNumber, PNF.E164)
    let show = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL)

    if (show) {
      show = country === 'IM'
        ? show.replace('1624' + ' ', '')
        : show.replace(`${prefix} `, '')
    }
    return {
      verify,
      value,
      show,
    }
  }
  catch {
    return {
      verify: false,
      value: '',
      show: phone,
    }
  }
}
