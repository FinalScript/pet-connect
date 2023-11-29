import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

import { Image as ImageType } from 'react-native-image-crop-picker';
import { Asset } from 'react-native-image-picker';

export const uploadToFirebase = async (file: Asset) => {
  if (!file || !file.uri) {
    return;
  }

  const response = await fetch(file.uri);

  const blob = await response.blob();

  const storageRef = ref(storage, `/files/${file.fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

      // update progress
    },
    (err) => console.log(err),
    () => {
      // download url
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log(url);
      });
    }
  );
};
