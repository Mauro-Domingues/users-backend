import type { Root, Schema } from 'joi';

const getMaxSizeInBytes = (mb: number): number => {
  const bytesPerMB = 1024 * 1024;
  return mb * bytesPerMB;
};

export const uploadedFileSchema = (
  ctx: Root,
): Record<keyof Express.Multer.File, Schema> => ({
  buffer: ctx.binary(),
  destination: ctx.string(),
  encoding: ctx.string(),
  fieldname: ctx.string().valid('files'),
  filename: ctx.string(),
  mimetype: ctx
    .string()
    .valid(
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'audio/mpeg',
      'audio/mp4',
      'audio/wav',
      'audio/flac',
      'audio/ogg',
      'audio/aac',
      'video/mp4',
      'video/x-msvideo',
      'video/quicktime',
      'video/x-matroska',
      'text/plain',
      'text/csv',
      'text/html',
      'text/css',
      'text/javascript',
    )
    .required(),
  originalname: ctx.string().max(255).required(),
  path: ctx.string().required(),
  stream: ctx.any().required(),
  size: ctx.number().max(getMaxSizeInBytes(10)).required(),
});
