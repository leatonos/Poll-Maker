import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';

//import firebase config
import { firebase_app } from './components/firebase_config.js';

// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Initialize Firebase
const db = getFirestore(firebase_app);

function Option() {
  return (
    <div>
      <h3>Option</h3>
    </div>
  );
}

export default function Home() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);

  const addOption = () =>{
    let currentOptions = [...options]
    currentOptions.push({
      text:'',
      votes:0
    })
    setOptions(currentOptions)

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Poll Creator</title>
      </Head>
      <h1>Pool Creator</h1>
      <form>
        <label htmlFor="questionInput">Question</label>
        <input onChange={(e) => setQuestion(e.target.value)}></input>
        <button onClick={addOption}>Add Option</button>
        <div>
          {options.map(() => {
            <Option />;
          })}
        </div>
      </form>

      <p>{question}</p>
    </div>
  );
}
