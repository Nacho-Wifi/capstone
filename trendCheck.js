import { collection, where, query, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

import * as brain from 'brain.js';

//create a new instance of network
const network = new brain.NeuralNetwork();

network.train([
  { input: [1, 1, 1, 1, 1, 1, 1], output: [1] },
  { input: [1, 1, 2, 1, 2, 1, 1], output: [1] },
  { input: [2, 2, 2, 1, 1, 1, 1], output: [1] },
  { input: [5, 5, 5, 5, 5, 5, 5], output: [0] },
  { input: [5, 4, 4, 4, 5, 4, 5], output: [0] },
  { input: [3, 4, 3, 4, 3, 4, 5], output: [0] },
  { input: [3, 3, 3, 3, 3, 3, 3], output: [0] },
]);

const checkIfOk = () => {
  const week = () => {
    let weekInQuestion = [];
    let date = new Date();
    for (let i = 0; i <= 7; i++) {
      let dayInQuestion = date.setDate(date.getDate() - 7);
      weekInQuestion.push(dayInQuestion.toDateString());
    }
    return weekInQuestion;
  };

  let daysOfTheWeek = week();
  let entries = [];

  const q = query(
    collection(db, 'Journals'),
    where('userId', '==', auth.currentUser.email),
    where('createdAt', 'in', [daysOfTheWeek])
  );

  const querySnapshot = getDocs(q);
  querySnapshot.forEach((doc) => {
    entries.push(doc.mood.scale);
  });

  const output = network.run(entries);

  if (output && output > 0.5) {
    console.log('I am concerned!!!');
  } else {
    console.log('I am not concerned!!!!!!');
  }
};

export default checkIfOk;

//this gives us the createdAt for 7 days of journals
