import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore/lite';
import { uploadBookPicture, deleteBookImage } from './storage';
import { db } from './Initialize';
export const deleteDocumentById = async (id, collectionName) => {
  const docRef = doc(collection(db, collectionName), id);
  deleteBookImage(id);
  await deleteDoc(docRef);
  console.log('Document successfully deleted!');
};
export const getDocumentById = async (id, collectionName) => {
  const docRef = doc(collection(db, collectionName), id);
  const book = await getDoc(docRef);
  console.log('book successfully found!');
  return book.data();
};
export const setBook = async (
  title,
  brief,
  coverImage,
  status,
  publishDate,
  authorId,
  authorName,
  bookId,
  coverImageSrc
) => {
  try {
    const bookData = {
      title: title,
      brief: brief,
      publishDate: Timestamp.fromDate(publishDate),
      status: status,
      author: authorId,
      authorName: authorName,
      coverImage: coverImageSrc,
    };
    console.log(bookData);
    if (status === 'draft') {
      await setDoc(doc(db, 'draft', bookId), bookData).then((documentRef) => {
        if (coverImage) uploadBookPicture(coverImage, authorId, bookId, status);
        else {
        }
      });
      //  const uploadBookImage = functions.httpsCallable('uploadBookImage');
      console.log('Book draft saved to Firestore.');
    } else {
      // If status is not draft, upload the book and trigger the cloud function
      await setDoc(doc(db, 'published', bookId), bookData).then(
        (documentRef) => {
          if (coverImage)
            uploadBookPicture(coverImage, authorId, bookId, status);
          else {
          }
        }
      );
      console.log('Book published saved to Firestore.');
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const addBook = async (
  title,
  brief,
  coverImage,
  status,
  publishDate,
  authorId,
  authorName
) => {
  try {
    const bookRef = collection(db, 'published');

    const bookId = doc(bookRef).id;

    const bookData = {
      title: title,
      brief: brief,
      publishDate: Timestamp.fromDate(publishDate),
      status: status,
      author: authorId,
      authorName: authorName,
    };
    console.log(bookData);
    if (status === 'draft') {
      await setDoc(doc(db, 'draft', bookId), bookData).then((documentRef) => {
        if (coverImage) uploadBookPicture(coverImage, authorId, bookId, status);
      });
      //  const uploadBookImage = functions.httpsCallable('uploadBookImage');
      console.log('Book draft saved to Firestore.');
    } else {
      // If status is not draft, upload the book and trigger the cloud function
      await setDoc(doc(db, 'published', bookId), bookData).then(
        (documentRef) => {
          if (coverImage)
            uploadBookPicture(coverImage, authorId, bookId, status);
        }
      );
      console.log('Book published saved to Firestore.');
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const getAllAuthors = async () => {
  const collectionRef = collection(db, 'users');
  const querySnapshot = await getDocs(collectionRef);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    bio: doc.data().bio,
    birth: doc.data().birth,
    email: doc.data().email,
    profPic: doc.data().profileImageURL,
    //...doc.data(),
  }));
  console.log(data);
  return data;
};
export const getAllBooksPublishedNdDrafted = async () => {
  const collectionRefPublished = collection(db, 'published');
  const querySnapshotPublished = await getDocs(collectionRefPublished);
  const dataPublished = querySnapshotPublished.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    brief: doc.data().brief,
    publishDate: doc.data().publishDate,
    coverImage: doc.data().coverImage,
    author: doc.data().authorName,
    status: 'published',
    //...doc.data(),
  }));
  const collectionRefDrafted = collection(db, 'draft');
  const querySnapshotDrafted = await getDocs(collectionRefDrafted);
  const dataDrafted = querySnapshotDrafted.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    brief: doc.data().brief,
    publishDate: doc.data().publishDate,
    coverImage: doc.data().coverImage,
    author: doc.data().authorName,
    status: 'draft',
    //...doc.data(),
  }));
  console.log(dataPublished);
  console.log(dataDrafted);
  const data = [...dataPublished, ...dataDrafted];
  console.log(data);
  return data;
};
export const getAllBooks = async () => {
  const collectionRef = collection(db, 'published');
  const querySnapshot = await getDocs(collectionRef);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    brief: doc.data().brief,
    publishDate: doc.data().publishDate,
    coverImage: doc.data().coverImage,
    author: doc.data().authorName,
    status: 'published',
    //...doc.data(),
  }));
  console.log(data);
  return data;
};
export const getBooksbyAuthorPublishedNdDraft = async (authorId) => {
  console.log(authorId);
  const qPublished = query(
    collection(db, 'published'),
    where('author', '>=', authorId)
  );
  const queryPublishedSnapshot = await getDocs(qPublished);

  const docsPublished = queryPublishedSnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    brief: doc.data().brief,
    publishDate: doc.data().publishDate,
    coverImage: doc.data().coverImage,
    author: doc.data().authorName,
    status: 'published',
    //...doc.data(),
  }));
  const qDrafted = query(
    collection(db, 'draft'),
    where('author', '>=', authorId)
  );
  const queryDraftedSnapshot = await getDocs(qDrafted);

  const docsDrafted = queryDraftedSnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    brief: doc.data().brief,
    publishDate: doc.data().publishDate,
    coverImage: doc.data().coverImage,
    author: doc.data().authorName,
    status: 'draft',
    //...doc.data(),
  }));
  console.log(docsPublished);
  console.log(docsDrafted);
  const data = [...docsPublished, ...docsDrafted];
  console.log(data);
  return data;
};
export const searchForBooksbyAuthorPublishedNdDraft = async (
  authorId,
  searchValue
) => {
  console.log(authorId);
  const qAuthorPublished = query(
    collection(db, 'published'),
    where('author', '>=', authorId)
  );
  const qTitlePublished = query(
    collection(db, 'published'),
    where('title', '>=', searchValue),
    where('title', '<=', searchValue + '\uf8ff')
  );
  const queryAuthorPublishedSnapshot = await getDocs(qAuthorPublished);
  const queryTitlePublishedSnapshot = await getDocs(qTitlePublished);
  const mergedPublishedDocs = queryAuthorPublishedSnapshot.docs.filter(
    (authorDoc) =>
      queryTitlePublishedSnapshot.docs.some(
        (titleDoc) => titleDoc.id === authorDoc.id
      )
  );
  const docsPublished = mergedPublishedDocs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    brief: doc.data().brief,
    publishDate: doc.data().publishDate,
    coverImage: doc.data().coverImage,
    author: doc.data().authorName,
    status: 'published',
    //...doc.data(),
  }));
  const qAuthorDrafted = query(
    collection(db, 'draft'),
    where('author', '>=', authorId),
    orderBy('author')
  );
  const qTitleDrafted = query(
    collection(db, 'draft'),
    where('title', '>=', searchValue),
    where('title', '<=', searchValue + '\uf8ff'),
    orderBy('title')
  );
  const queryAuthorDraftedSnapshot = await getDocs(qAuthorDrafted);
  const queryTitleDraftedSnapshot = await getDocs(qTitleDrafted);

  const mergedDraftDocs = queryAuthorDraftedSnapshot.docs.filter((authorDoc) =>
    queryTitleDraftedSnapshot.docs.some(
      (titleDoc) => titleDoc.id === authorDoc.id
    )
  );
  const docsDrafted = mergedDraftDocs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    brief: doc.data().brief,
    publishDate: doc.data().publishDate,
    coverImage: doc.data().coverImage,
    author: doc.data().authorName,
    status: 'draft',
    //...doc.data(),
  }));
  console.log(docsPublished);
  console.log(docsDrafted);

  const data = [...docsPublished, ...docsDrafted];
  console.log(data);

  return data;
};
export const searchForBook = async (searchValue) => {
  if (searchValue.trim() !== '') {
    const q = query(
      collection(db, 'published'),
      where('title', '>=', searchValue),
      where('title', '<=', searchValue + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);

    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      brief: doc.data().brief,
      publishDate: doc.data().publishDate,
      coverImage: doc.data().coverImage,
      author: doc.data().authorName,
      //...doc.data(),
    }));
    console.log(docs);
    return docs;
  } else {
    return null;
  }
};
export const searchForAuthor = async (searchValue) => {
  if (searchValue.trim() !== '') {
    const q = query(
      collection(db, 'users'),
      where('name', '>=', searchValue),
      where('name', '<=', searchValue + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot.docs);
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      bio: doc.data().bio,
      birth: doc.data().birth,
      email: doc.data().email,
      profPic: doc.data().profileImageURL,
      //...doc.data(),
    }));
    console.log(docs);
    return docs;
  } else {
    return null;
  }
};
export const getAuthorByEmail = async (email) => {
  console.log(email);
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  if (querySnapshot.docs.length === 0) {
    return null; // user not found
  }
  const userData = {
    ...querySnapshot.docs[0].data(),
    ...{ id: querySnapshot.docs[0].id },
  };
  console.log(userData);
  return userData;
};

export const updateAuthor = async (docId, data) => {
  try {
    const docRef = doc(db, 'users', docId);
    await updateDoc(docRef, data);
    console.log('profile updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};
