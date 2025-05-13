import { isArray } from '@hairy/utils'

export function removeInnerHTMLAttributes(html: string, attribute: string | string[]) {
  return (isArray(attribute) ? attribute : [attribute]).reduce(
    (total, attribute) => total.replace(new RegExp(`${attribute}=['"](.*?)['"]`, 'gis'), ''),
    html,
  )
}
