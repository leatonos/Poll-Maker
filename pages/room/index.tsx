import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useState, useEffect } from 'react';

import { DocumentData } from 'firebase/firestore';

//import firebase config
import  firebase_app  from '../components/firebase_config.js';

// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Initialize Firebase
const db = getFirestore(firebase_app);

export default function Home() {
  const [test, setTest] = useState<DocumentData>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'polls', 'Ci29zb52RrUXu2qruP08'),
      (doc) => {
        console.log('Current data: ', doc.data());
        setTest(doc.data());
      }
    );
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Poll Creator</title>
      </Head>
      <h1>Pool Creator</h1>
      <p>{JSON.stringify(test)}</p>
    </div>
  );
}
