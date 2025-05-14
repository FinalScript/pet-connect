import { createWriteStream, unlink } from 'fs';
import multer from 'multer';
import { join } from 'path';
import { URL } from 'url';

export const allowedFileTypes = ['.jpg', '.jpeg', '.png', 'image/png', 'image/jpg', 'image/jpeg', 'image/heic'];

// Set up Multer middleware
export const storage = multer.diskStorage({
  destination: 'uploads/',

  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});

// @ts-check

const UPLOAD_DIRECTORY_URL = 'uploads/';

/**
 * Stores a GraphQL file upload in the filesystem.
 * @param {Promise<
 *   import("graphql-upload/processRequest.mjs").FileUpload
 * >} upload GraphQL file upload.
 * @returns {Promise<string>} Resolves the stored file name.
 */
export async function storeUpload(upload) {
  const { createReadStream, filename } = await upload;
  const stream = createReadStream();
  const storedFileName = `${Date.now()}-${filename}`;
  const storedFileUrl = UPLOAD_DIRECTORY_URL + storedFileName;

  // Store the file in the filesystem.
  await new Promise((resolve, reject) => {
    // Create a stream to which the upload will be written.
    const writeStream = createWriteStream(storedFileUrl);

    // When the upload is fully written, resolve the promise.
    writeStream.on('finish', resolve);

    // If there's an error writing the file, remove the partially written file
    // and reject the promise.
    writeStream.on('error', (error) => {
      unlink(storedFileUrl, () => {
        reject(error);
      });
    });

    // In Node.js <= v13, errors are not automatically propagated between piped
    // streams. If there is an error receiving the upload, destroy the write
    // stream with the corresponding error.
    stream.on('error', (error) => writeStream.destroy(error));

    // Pipe the upload into the write stream.
    stream.pipe(writeStream);
  });
 
  return { filename: storedFileName, filePath: storedFileUrl, root: UPLOAD_DIRECTORY_URL, mimetype: upload.mimetype };
}
