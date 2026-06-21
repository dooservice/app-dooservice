import { useTranslation } from 'react-i18next'
import { LockIcon } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter,
} from '@/components/dialog'
import Button from '@/components/button'

interface Props {
  open:    boolean
  onClose: () => void
  reason:  string
}

export default function UpgradeDialog({ open, onClose, reason }: Props) {
  const { t } = useTranslation('environments')

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockIcon className="h-4 w-4" />{t('plans.upgradeTitle')}
          </DialogTitle>
          <DialogDescription>{reason}</DialogDescription>
        </DialogHeader>
        <DialogBody />
        <DialogFooter>
          <Button onClick={onClose}>{t('plans.upgradeClose')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
