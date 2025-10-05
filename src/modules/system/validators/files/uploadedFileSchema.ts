import { Joi } from 'celebrate';

const getMaxSizeInBytes = (mb: number): number => {
  const bytesPerMB = 1024 * 1024;
  return mb * bytesPerMB;
};

export const uploadedFileSchema: Record<keyof Express.Multer.File, Joi.Schema> =
  {
    buffer: Joi.binary(),
    destination: Joi.string(),
    encoding: Joi.string(),
    fieldname: Joi.string().valid('files'),
    filename: Joi.string(),
    mimetype: Joi.string()
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
    originalname: Joi.string().max(255).required(),
    path: Joi.string().required(),
    stream: Joi.any().required(),
    size: Joi.number().max(getMaxSizeInBytes(10)).required(),
  };
