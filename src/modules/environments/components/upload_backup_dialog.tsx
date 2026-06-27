import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { UploadIcon } from 'lucide-react'
import { useGetMultipartUploadUrl, useCompleteMultipartUpload } from '@/modules/environments/api/use_backups'
import { toast } from '@/hooks/use_toast'
import type { Environment } from '@/modules/environments/types/environment.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogDescription } from '@/components/dialog'
import Button from '@/components/button'
import Spinner from '@/components/spinner'

interface Props {
  open:      boolean
  env:       Environment
  projectId: string
  onClose:   () => void
}

type UploadPhase = 'select' | 'uploading' | 'importing' | 'done'

export default function UploadBackupDialog({ open, env, projectId, onClose }: Props) {
  const { t } = useTranslation('backups')

  const [selectedFile, setSelectedFile]     = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [phase, setPhase]                   = React.useState<UploadPhase>('select')

  const { mutateAsync: getMultipartUrl }      = useGetMultipartUploadUrl(projectId)
  const { mutateAsync: completeMultipart }    = useCompleteMultipartUpload(projectId)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleClose() {
    if (phase === 'uploading' || phase === 'importing') return
    setSelectedFile(null)
    setUploadProgress(0)
    setPhase('select')
    onClose()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) return

    try {
      setPhase('uploading')
      setUploadProgress(0)

      const { object_key, upload_id, part_urls, part_size } = await getMultipartUrl({
        envId: env.id,
        fileSize: selectedFile.size,
      })

      const parts = await uploadParts(selectedFile, part_urls, part_size, setUploadProgress)

      setPhase('importing')
      await completeMultipart({ envId: env.id, objectKey: object_key, uploadId: upload_id, parts, fileSize: selectedFile.size })

      setPhase('done')
      toast({ title: t('uploadDialog.imported'), description: t('uploadDialog.importedDesc') })
      handleClose()
    } catch (err: unknown) {
      setPhase('select')
      setUploadProgress(0)
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast({ title: t('uploadDialog.failed'), description: message, variant: 'destructive' })
    }
  }

  const isPending = phase === 'uploading' || phase === 'importing'

  return (
    <Dialog open={open} onOpenChange={isOpen => { if (!isOpen) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('uploadDialog.title')}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <DialogDescription
            dangerouslySetInnerHTML={{ __html: t('uploadDialog.description', { name: env.name }) }}
          />

          <div
            className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-zinc-200 bg-zinc-50 py-8 cursor-pointer hover:border-zinc-300 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="h-8 w-8 text-zinc-400" strokeWidth={1.5} />
            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-700">{selectedFile.name}</p>
                <p className="text-xs text-zinc-400">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">{t('uploadDialog.selectFile')}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </div>

          {phase === 'uploading' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>{t('uploadDialog.uploading')}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-200">
                <div
                  className="h-1.5 rounded-full bg-brand-teal transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {phase === 'importing' && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Spinner className="h-4 w-4 text-zinc-400 animate-spin" />
              {t('uploadDialog.registering')}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={handleClose} disabled={isPending}>
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button
            type="button"
            loading={isPending}
            disabled={!selectedFile || isPending}
            icon={<UploadIcon className="h-3.5 w-3.5" />}
            onClick={handleUpload}
          >
            {t('upload')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

async function uploadParts(
  file: File,
  partUrls: string[],
  partSize: number,
  onProgress: (pct: number) => void,
): Promise<Array<{ PartNumber: number; ETag: string }>> {
  const parts: Array<{ PartNumber: number; ETag: string }> = []

  for (let i = 0; i < partUrls.length; i++) {
    const start = i * partSize
    const chunk = file.slice(start, start + partSize)

    const etag = await uploadPartWithProgress(partUrls[i], chunk, chunkPct => {
      onProgress(Math.round(((i + chunkPct / 100) / partUrls.length) * 100))
    })

    parts.push({ PartNumber: i + 1, ETag: etag })
  }

  return parts
}

async function uploadPartWithProgress(
  url: string,
  chunk: Blob,
  onProgress: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader('ETag')
        if (!etag) {
          reject(new Error('ETag header missing — configure CORS ExposeHeaders: ETag on the S3 bucket'))
          return
        }
        onProgress(100)
        resolve(etag)
      } else {
        reject(new Error(`Part ${xhr.status} upload failed`))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.send(chunk)
  })
}
