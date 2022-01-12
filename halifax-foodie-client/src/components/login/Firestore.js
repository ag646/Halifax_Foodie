import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyA41MgIcA8Xf-5n-f1JQvTzOnpSZftKOXg",
  authDomain: "csci-5410-s21-314709.firebaseapp.com",
  projectId: "csci-5410-s21-314709",
  storageBucket: "csci-5410-s21-314709.appspot.com",
  messagingSenderId: "338867992226",
  appId: "1:338867992226:web:5674ba037fd66cd45dc9fb"
};

firebase.initializeApp(firebaseConfig);

export default firebase;