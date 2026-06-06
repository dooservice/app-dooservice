import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangleIcon } from 'lucide-react'
import { useDeleteAccount } from '@/features/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogDescription } from '@/components/dialog'
import Button from '@/components/button'

export default function DeleteAccountCard() {
  const { t }                                        = useTranslation('auth')
  const { mutate: deleteAccount, isPending }         = useDeleteAccount()
  const [open, setOpen]                              = React.useState(false)

  return (
    <>
      <Card className="border-red-600/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangleIcon className="h-4 w-4" />{t('deleteAccount.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-red-500/5 rounded-b-md">
          <p className="text-sm text-zinc-600 mb-4">{t('deleteAccount.description')}</p>
          <Button variant="destructive" onClick={() => setOpen(true)}>{t('deleteAccount.button')}</Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteAccount.dialogTitle')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>{t('deleteAccount.dialogDescription')}</DialogDescription>
          </DialogBody>
          <DialogFooter>
            <Button variant="destructive" loading={isPending} onClick={() => deleteAccount()}>
              {t('deleteAccount.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
