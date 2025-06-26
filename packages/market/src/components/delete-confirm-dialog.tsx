import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { useExtendOverlay } from '@overlastic/react'

export function DeleteConfirmDialog() {
  const { visible, resolve, reject } = useExtendOverlay({
    duration: 500,
  })

  return (
    <Modal isOpen={visible} size="md" onClose={reject}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">Confirm Deletion</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this order? This action cannot be undone.</p>
        </ModalBody>
        <ModalFooter className="pt-2">
          <Button size="sm" color="danger" variant="light" onPress={reject}>
            Cancel
          </Button>
          <Button size="sm" color="warning" onPress={resolve}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
