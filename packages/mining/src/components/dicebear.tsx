import type { Style, StyleOptions } from '@dicebear/core'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import { createAvatar } from '@dicebear/core'

type DetailedHTMLImageProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

export type DicebearProps<O extends object> =
  & { style: Style<O> }
  & Omit<DetailedHTMLImageProps, 'style'>
  & StyleOptions<O>

export function Dicebear<O extends object>(props: DicebearProps<O>) {
  const url = createAvatar(props.style, props).toDataUri()
  return (
    <img
      src={url}
      className={props.className}
      onClick={props.onClick}
      about={props.about}
      alt={props.alt}
    />
  )
}
