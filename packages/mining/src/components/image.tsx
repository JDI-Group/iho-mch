/* eslint-disable react/no-clone-element */
import type { ImageProps as HeroImageProps } from '@heroui/react'
import type { ReactNode } from 'react'
import { useImage } from '@heroui/react'
import { forwardRef } from '@heroui/system'
import { cloneElement } from 'react'

export interface ImageProps extends HeroImageProps {
  // TODO show
  fallback?: ReactNode
}

export const Image = forwardRef<'img', ImageProps>((props, ref) => {
  const {
    Component,
    domRef,
    slots,
    classNames,
    isBlurred,
    isZoomed,
    fallbackSrc,
    removeWrapper,
    disableSkeleton,
    getImgProps,
    getWrapperProps,
    getBlurredImgProps,
  } = useImage({
    ...props,
    ref,
  })
  const showFallbackNode = !!props.fallback || !props.src

  const content = showFallbackNode
    ? props.fallback as any
    : (<Component ref={domRef} {...getImgProps()} />)

  if (removeWrapper) {
    return content
  }

  const zoomed = (
    <div className={slots.zoomedWrapper({ class: classNames?.zoomedWrapper })}>{content}</div>
  )

  if (isBlurred) {
    // clone element to add isBlurred prop to the cloned image
    return (
      <div {...getWrapperProps()}>
        {isZoomed ? zoomed : content}
        {cloneElement(content, getBlurredImgProps())}
      </div>
    )
  }

  // when zoomed or showSkeleton, we need to wrap the image
  if (isZoomed || !disableSkeleton || fallbackSrc) {
    return <div {...getWrapperProps()}> {isZoomed ? zoomed : content}</div>
  }

  return content
})

Image.displayName = 'HeroUI.ImageCustom'
