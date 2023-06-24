import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Graph from '../components/graph'


import firebase_app from '../components/firebase_config';

// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, onSnapshot,runTransaction } from 'firebase/firestore';

// Initialize Firebase

export default function Room() {
  const [options, setOptions] = useState([])
  const [question,setQuestion] = useState([])
  const [pollStatus, setPollStatus] = useState('PollVote')


  const router = useRouter();
  const pollId = router.query.id
  const db = getFirestore(firebase_app);



  const pollLink = pollId != '' ? `https://localhost:3000/room/${pollId}` : ''
  
  

  useEffect(()=>{

    if(pollId){
    
      var unsub = onSnapshot(doc(db, "polls", pollId), (doc) => {
        if(doc.exists()){
          setQuestion(doc.data().question)
          setOptions(doc.data().options)
          console.log(doc.data())
        }
        
      })

    }
    return ()=>{
      unsub
    }

   
  },[pollId])



  const vote = async(index) =>{
    const sfDocRef = doc(db, "polls", pollId);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        } 
    
        let voteOptions = [...sfDoc.data().options]
        voteOptions[index].votes+=1;       
        transaction.update(sfDocRef, { options: voteOptions });
      });
      console.log("Transaction successfully committed!");
      setPollStatus('PollResults')
    } catch (e) {
      console.log("Transaction failed: ", e);
    }

  }

  function PollVote(){

    if(pollStatus != 'PollVote'){
      return
    }

    return(
      <div>
        <h1>{question}</h1>
        {
        //Options
        }
        <div>
        {options.map((option,index)=>{
          return (
            <div key={index}>
              <button onClick={()=>vote(index)}>{option.text}</button>
            </div>
          )
        })}

        </div>
      </div>
      
    )
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
        <Graph options={options}/>
        <div><Link href={`/room/${pollId}`}>{pollLink}</Link></div>
        <button type="button" onClick={askNewQuestion}>
          Ask a new question
        </button>
      </div>
    );
  }
 

  return (
    <div className={styles.container}>
      <Head>
        <title>Poll Creator</title>
      </Head>
      <PollVote/>
      <PollResults/>
    </div>
  );
}
