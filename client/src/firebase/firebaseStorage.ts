import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';
import { Asset } from 'react-native-image-picker';
import { Image } from 'react-native-image-crop-picker';
import { uniqueId } from 'lodash';

export enum storageFolders {
  PROFILE_PICTURES,
  POSTS,
}

export interface UploadToFirebaseResult {
  name: string;
  url: string;
  path: string;
  type: string;
  aspectRatio: number;
}

export const updateFileInFirebase = (file: Image, path: string) => {
  return new Promise<UploadToFirebaseResult>(async (resolve, reject) => {
    if (!file.path) {
      reject('File uri not found');
      return;
    }

    const response = await fetch(file.path);

    const blob = await response.blob();

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        // update progress
      },
      (err) => {
        console.log(err);
        reject(err);
      },
      () => {
        // download url
        console.log(uploadTask.snapshot.metadata);
        console.log(uploadTask.snapshot.ref);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          resolve({
            name: uploadTask.snapshot.metadata.name,
            url,
            path: uploadTask.snapshot.metadata.fullPath,
            type: uploadTask.snapshot.metadata.contentType || '',
            aspectRatio: (file.width || 0) / (file.height || 0),
          });
          return;
        });
      }
    );
  });
};

export const uploadToFirebase = (file: Image, folder: storageFolders) => {
  return new Promise<UploadToFirebaseResult>(async (resolve, reject) => {
    if (!file.path) {
      reject('File uri not found');
      return;
    }

    const response = await fetch(file.path);

    const blob = await response.blob();

    const filename = file.filename || file.path.split('/').pop();
    const storageRef = ref(storage, `/${folder.toString()}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        // update progress
      },
      (err) => {
        console.log(err);
        reject(err);
      },
      () => {
        // download url
        console.log(uploadTask.snapshot.metadata);
        console.log(uploadTask.snapshot.ref);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          resolve({
            name: uploadTask.snapshot.metadata.name,
            url,
            path: uploadTask.snapshot.metadata.fullPath,
            type: uploadTask.snapshot.metadata.contentType || '',
            aspectRatio: (file.width || 0) / (file.height || 0),
          });
          return;
        });
      }
    );
  });
};

export const deleteFromFirebase = (path: string) => {
  return new Promise<void>((resolve, reject) => {
    const storageRef = ref(storage, path);
    deleteObject(storageRef)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
