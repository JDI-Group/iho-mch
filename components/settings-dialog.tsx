import { settings } from '@/config/settings'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal'
import { Tab, Tabs } from '@heroui/tabs'
import { useExtendOverlay } from '@overlastic/react'

export interface SettingsDialogProps {
  target?: typeof settings[number]['key']
}

export function SettingsDialog(props: SettingsDialogProps) {
  const { visible, resolve } = useExtendOverlay({
    duration: 500,
  })
  const [current, setCurrent] = useState<typeof settings[number]>()

  return (
    <Modal
      isKeyboardDismissDisabled={true}
      isDismissable={false}
      isOpen={visible}
      onOpenChange={resolve}
      size={current?.width || 'lg'}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Settings
        </ModalHeader>
        <ModalBody>
          <Tabs
            onSelectionChange={key => setCurrent(settings.find(item => item.key === key))}
            selectedKey={props.target}
            aria-label="Options"
            variant="underlined"
          >
            {settings.map(item => (
              <Tab key={item.key} title={item.title}>
                {item.child()}
              </Tab>
            ))}
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
