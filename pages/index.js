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

export default function Home() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [pollStatus, setPollStatus] = useState('PollCreator');

  //Option Component
  function Option(props) {
    const removeOption = () => {
      let currentOptions = [...options];
      currentOptions.splice(props.index, 1);
      setOptions(currentOptions);
    };

    const editOption = (newText) => {
      let currentOptions = [...options];
      currentOptions[props.index].text = newText;
      setOptions(currentOptions);
    };

    return (
      <div>
        <label htmlFor={`option${props.index}`}>Option {props.index + 1}</label>
        <input
          onBlur={(e) => editOption(e.target.value)}
          defaultValue={options[props.index].text}
          type="text"
        ></input>
        <button onClick={removeOption} type="button">
          Delete Option
        </button>
      </div>
    );
  }

  //Poll Creator Component
  function PollCreator() {
    return (
      <div>
        <h1>Pool Creator</h1>
        <form onSubmit={createPoll}>
          <label htmlFor="questionInput">Question</label>
          <input onChange={(e) => setQuestion(e.target.value)}></input>
          <button type="button" onClick={addOption}>
            Add Option
          </button>
          <div>
            {options.map((option, index) => {
              return <Option key={index} index={index} />;
            })}
          </div>
          <button type="submit">Start Poll</button>
        </form>
      </div>
    );
  }

  //Add option button function
  const addOption = () => {
    let currentOptions = [...options];
    currentOptions.push({
      text: '',
      votes: 0,
    });
    setOptions(currentOptions);
  };

  //Create Room
  const createPoll = (e) => {
    e.preventDefault();

    const newDocument = {
      createdTime: new Date(),
      question: question,
      options: options,
    };

    console.log(newDocument);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Poll Creator</title>
      </Head>
      <PollCreator />
    </div>
  );
}
