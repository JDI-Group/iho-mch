import type { Product } from '@/api/index.type'
import { removeInnerHTMLAttributes } from '@/utils'
import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { useExtendOverlay } from '@overlastic/react'

export interface ProductDetailDialogProps {
  detail: Product
}

export function ProductDetailDialog(props: ProductDetailDialogProps) {
  const { visible, resolve } = useExtendOverlay({
    duration: 500,
  })
  const html = removeInnerHTMLAttributes(props.detail.short_description || '', 'class')
  return (
    <Modal
      isKeyboardDismissDisabled={true}
      isOpen={visible}
      onOpenChange={resolve}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {props.detail.name}
          {' '}
          Detail
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4" dangerouslySetInnerHTML={{ __html: html }} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={resolve}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
