import { fonts } from '@/config/fonts'
import { settings } from '@/config/settings'
import { Else, If, Then } from '@hairy/react-lib'
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
  const current = settings.find(item => item.key === props.target)

  return (
    <Modal
      isKeyboardDismissDisabled={true}
      isDismissable={false}
      isOpen={visible}
      onOpenChange={resolve}
      className={fonts.barlow.className}
      size="5xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {current ? current.title : 'Settings'}
        </ModalHeader>
        <ModalBody>
          <If cond={!current}>
            <Then>
              <Tabs
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
            </Then>
            <Else>
              {current?.child()}
            </Else>
          </If>

        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
