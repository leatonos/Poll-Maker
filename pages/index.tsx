import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';

//import firebase config
import firebase_app from './components/firebase_config.js';


// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';

// Initialize Firebase
const db = getFirestore(firebase_app);

export default function Home() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [optionList, setOptionsList] = useState([]);
  const [pollId, setPollId] = useState('');
  const [pollStatus, setPollStatus] = useState('PollCreator');

  const pollLink = pollId != '' ? `https://localhost:3000/room/${pollId}` : ''

  useEffect(()=>{

    if(pollId != ''){
    
      var unsub = onSnapshot(doc(db, "polls", pollId), (doc) => {
        setOptions(doc.data().options)
      })

    }
    return ()=>{
      unsub
    }

   
  },[])

 

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
        <label htmlFor={`option${props.index}`}> Option {props.index + 1}</label>
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
    if (pollStatus != 'PollCreator') {
      return;
    }

    

    return (
      <div>
        <h1>Pool Creator</h1>
        <form onSubmit={createPoll}>
          <label htmlFor="questionInput">Question</label>
          <input
            onBlur={(e) => setQuestion(e.target.value)}
            defaultValue={question}
          ></input>
          <button type="button" onClick={addOption}>
             +
          </button>
          <div>
            {optionList.map((option, index) => {
              return <Option key={index} index={index} />;
            })}
          </div>
          <button type="submit">Start Poll</button>
          <p>
            <Link href={`/room/${pollId}`}>{pollLink}</Link>
          </p>
        </form>
      </div>
    );
  }

  function PollResults() {
    if (pollStatus != 'PollResults') {
      return;
    }
    
    const totalVotes = () => {
      let totalVoteCount = 0;

      for (let option of options) {
        totalVoteCount += option.votes;
      }

      return totalVoteCount;
    };

    const askNewQuestion = () => {
      setPollStatus('PollCreator');
    };

    return (
      <div>
        <h2>Poll Results</h2>
        <div>
          <h3>{question}</h3>
          {options.map((option, index) => {
            const porcentage = () =>{
             if (totalVotes() == 0){return 0}
             else{return option.votes/totalVotes()*100}
            }
            return (
              <p key={index}>
                {option.text} votes:{option.votes} {porcentage().toFixed(2)}%
              </p>
            );
          })}
          <p>Total Votes: {totalVotes()}</p>
        </div>
        <div><Link href={`/room/${pollId}`}>{pollLink}</Link></div>
        <button type="button" onClick={askNewQuestion}>
          Ask a new question
        </button>
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
    setOptionsList(currentOptions)
  };

  //Create/Update Room
  const createPoll = async (e) => {
    e.preventDefault();

    const newDocument = {
      createdTime: serverTimestamp(),
      question: question,
      options: options,
    };

    // If there is no poll id yet, adds a new poll with a generated id.
    if (pollId == '') {
      const docRef = await addDoc(collection(db, 'polls'), newDocument);
      console.log('Document written with ID: ', docRef.id);
      setPollId(docRef.id);
      setPollStatus('PollResults');
    } else {
      console.log('I am here');
      //id we already have an Id we save ut
      await setDoc(doc(db, 'polls', pollId), newDocument);
      setPollStatus('PollResults');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Poll Creator</title>
      </Head>
      <PollCreator />
      <PollResults />
    </div>
  );
}
