import { BlobServiceClient } from '@azure/storage-blob';

export function getBlobServiceClient(): BlobServiceClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not defined');
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}
