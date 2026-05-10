import { BlockBlobClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { getBlobServiceClient } from '@/lib/azureBlobClient';

const mimeExtensionMap: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

function getContainerName() {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!containerName) {
    throw new Error('AZURE_STORAGE_CONTAINER_NAME is not defined');
  }

  return containerName;
}

function getBlobName(file: File) {
  const extension = mimeExtensionMap[file.type];

  if (!extension) {
    throw new Error('Unsupported file type');
  }

  return `${uuidv4()}.${extension}`;
}

export async function uploadCandidatePhoto(file: File): Promise<string> {
  const client = getBlobServiceClient();
  const containerClient = client.getContainerClient(getContainerName());
  const blockBlobClient = containerClient.getBlockBlobClient(getBlobName(file));
  const buffer = Buffer.from(await file.arrayBuffer());

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type }
  });

  return blockBlobClient.url;
}

export async function deleteBlobByUrl(url: string): Promise<void> {
  const blockBlobClient = new BlockBlobClient(url, getBlobServiceClient().credential);
  await blockBlobClient.deleteIfExists();
}
