import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Backup, BackupType } from '../types/environment.types'


export function useBackups(projectId: string, envId: string) {
  return useQuery({
    queryKey: ['backups', projectId, envId],
    queryFn:  () =>
      api.get(`api/projects/${projectId}/backups`, {
        searchParams: { environment_id: envId },
      })
         .json<{ backups: Backup[] }>()
         .then(r => r.backups),
    enabled:   !!projectId && !!envId,
    staleTime: 30_000,
  })
}

export function useCreateBackup(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ envId, backupType = 'full', description = '' }: { envId: string; backupType?: BackupType; description?: string }) =>
      api.post(`api/projects/${projectId}/backups`, {
        json: { environment_id: envId, backup_type: backupType, description },
      }).json<{ job_id: string }>(),
    onSuccess: (_, { envId }) =>
      queryClient.invalidateQueries({ queryKey: ['backups', projectId, envId] }),
  })
}

export function useRestoreBackup(projectId: string) {
  return useMutation({
    mutationFn: ({ backupId, envId }: { backupId: string; envId: string }) =>
      api.post(`api/projects/${projectId}/backups/${backupId}/restore`, {
        json: { environment_id: envId },
      }).json<{ job_id: string }>(),
  })
}


export function useBackupDownloadUrl(projectId: string) {
  return useMutation({
    mutationFn: (backupId: string) =>
      api.get(`api/projects/${projectId}/backups/${backupId}/download`)
         .json<{ download_url: string }>(),
  })
}

export function useGetMultipartUploadUrl(projectId: string) {
  return useMutation({
    mutationFn: ({ envId, fileSize }: { envId: string; fileSize: number }) =>
      api.post(`api/projects/${projectId}/backups/multipart-url`, {
        json: { environment_id: envId, file_size: fileSize },
      }).json<{ object_key: string; upload_id: string; part_urls: string[]; part_size: number }>(),
  })
}

export function useCompleteMultipartUpload(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      envId, objectKey, uploadId, parts, fileSize, description = '',
    }: {
      envId: string
      objectKey: string
      uploadId: string
      parts: Array<{ PartNumber: number; ETag: string }>
      fileSize: number
      description?: string
    }) =>
      api.post(`api/projects/${projectId}/backups/multipart-complete`, {
        json: { environment_id: envId, object_key: objectKey, upload_id: uploadId, parts, file_size: fileSize, description },
      }).json<{ job_id: string }>(),
    onSuccess: (_, { envId }) =>
      queryClient.invalidateQueries({ queryKey: ['backups', projectId, envId] }),
  })
}

