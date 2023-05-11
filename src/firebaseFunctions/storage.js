import { db, auth, storage } from './Initialize';
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore/lite';

import {
  ref,
  getDownloadURL,
  uploadBytes,
  getStorage,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';

export const deleteBookImage = async (id) => {
  // create a reference to the image file in storage
  // const imageRef = storage.refFromURL(imageUrl);

  const refBook = ref(storage, `books/${id}.jpg`);
  try {
    const downloadURL = await getDownloadURL(refBook);
    deleteObject(refBook)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    console.log('Profile picture download URL:', downloadURL);
  } catch (error) {
    console.log('Error getting profile picture:', error);
  }
};
export const uploadProfilePicture = async (fileImage, userId) => {
  const file = new Blob([fileImage], { type: 'image/jpeg' });
  //   const storageRef = storage.ref();
  //     const fileRef = storageRef.child(
  //       `profilePictures/${userId}/ProfilePicture.jpg`
  //     );
  const storageRef = ref(storage, `profilePictures/${userId}.jpg`);
  //   const storageWithoutApp = getStorage();
  //   const storageRef = ref(
  //     storageWithoutApp,
  //     'profilePictures/' + userId + '/' + 'ProfilePicture.jpg'
  //   );

  const metadata = {
    contentType: 'image/jpeg',
  };

  // Upload the file and metadata
  //   const uploadTask = uploadBytes(storageRef, file, metadata);
  // 'file' comes from the Blob or File API
  //   uploadBytes(storageRef, file).then((snapshot) => {
  //     console.log('Uploaded a blob or file!');
  //uploadProfilePictureToFirebase(file, userId, storageRef);
  //     console.log(snapshot);
  //   });
  uploadProfilePictureToFirebase(file, userId, storageRef);

  try {
    await uploadBytes(storageRef, file, metadata);
  } catch (e) {
    console.log(e);
  }
};
const uploadProfilePictureToFirebase = async (file, userId, storageRef) => {
  const metadata = {
    contentType: 'image/jpeg',
  };
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload progress: ${progress}%`);
    },
    (error) => {
      console.log('Error uploading profile image:', error);
    },
    async () => {
      // Save profile image URL to Firestore

      const userRef = doc(db, 'users', userId);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(userRef, { coverImage: downloadURL });

      console.log(
        'Profile image uploaded and URL saved to Firestore:',
        downloadURL
      );
    }
  );
};

export const getProfilePictureURL = async (userId) => {
  const storageRef = ref(
    storage,
    `profilePictures/${userId}/ProfilePicture.jpg`
  );

  try {
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Profile picture download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.log('Error getting profile picture:', error);
    return null;
  }
};

export const uploadBookPicture = async (
  fileImage,
  authorId,
  bookId,
  status
) => {
  const file = new Blob([fileImage], { type: 'image/jpeg' });
  //   const storageRef = storage.ref();
  //     const fileRef = storageRef.child(
  //       `profilePictures/${userId}/ProfilePicture.jpg`
  //     );
  const storageRef = ref(storage, `books/${bookId}.jpg`);
  const metadata = {
    contentType: 'image/jpeg',
  };
  uploadBookPictureToFirebase(file, bookId, storageRef, status);

  try {
    await uploadBytes(storageRef, file, metadata);
  } catch (e) {
    console.log(e);
  }
};
const uploadBookPictureToFirebase = async (
  file,
  bookId,
  storageRef,
  status
) => {
  const metadata = {
    contentType: 'image/jpeg',
  };
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload progress: ${progress}%`);
    },
    (error) => {
      console.log('Error uploading profile image:', error);
    },
    async () => {
      // Save profile image URL to Firestore

      if (status === 'draft') {
        const userRef = doc(db, 'draft', bookId);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(userRef, { coverImage: downloadURL });
        console.log(
          'Book image uploaded and URL saved to Firestore:',
          downloadURL
        );
      } else {
        const userRef = doc(db, 'published', bookId);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(userRef, { coverImage: downloadURL });
        console.log(
          'Book image uploaded and URL saved to Firestore:',
          downloadURL
        );
      }
    }
  );
};

export const getBookPictureURL = async (bookId) => {
  const storageRef = ref(storage, `books/${bookId}.jpg`);

  try {
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Profile picture download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.log('Error getting profile picture:', error);
    return null;
  }
};
