const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;
const functions = require('firebase-functions');

admin.initializeApp({
  projectId: 'authorbookproject',
});
const db = admin.firestore();

exports.scheduleFunction = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(async (context) => {
    try {
      const snapshot = await admin.firestore().collection('draft').get();
      const batch = admin.firestore().batch();
      const timestamp1 = Timestamp.now();

      const date1 = timestamp1.toDate();
      snapshot.docs.forEach(async (doc) => {
        const data = doc.data();
        console.log(doc.data());
        console.log(doc);
        //publishDate
        const date2 = data.birth.toDate();
        if (date1 > date2) {
          console.log('timestamp2 is before timestamp1');
          const newDocRef = admin
            .firestore()
            .collection('published')
            .doc(doc.id);
          batch.set(newDocRef, data);
          const docRef = admin.firestore().collection('draft').doc(doc.id);
          try {
            await docRef.delete();
            console.log(`Document with ID ${doc.id} deleted successfully.`);
          } catch (error) {
            console.error(`Error deleting document: ${error}`);
          }
        }
      });
      await batch.commit();
      console.log(
        `Successfully transferred data from collection1 to collection2.`
      );
    } catch (error) {
      console.error(`Error transferring data: ${error}`);
    }
  });
