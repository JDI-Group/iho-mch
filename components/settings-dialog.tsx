import { settings } from '@/config/settings'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal'
import { Tab, Tabs } from '@heroui/tabs'
import { useExtendOverlay } from '@overlastic/react'

export interface SettingsDialogProps {
  target?: typeof settings[number]['title']
}

export function SettingsDialog() {
  const { visible, resolve } = useExtendOverlay({
    duration: 500,
  })

  return (
    <Modal
      isKeyboardDismissDisabled={true}
      isOpen={visible}
      onOpenChange={resolve}
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Settings
        </ModalHeader>
        <ModalBody>
          <Tabs aria-label="Options" variant="underlined">
            {settings.map(item => (
              <Tab key={item.title} title={item.title}>
                {item.child()}
              </Tab>
            ))}
          </Tabs>
        </ModalBody>
      </ModalContent>

    </Modal>
  )
}
