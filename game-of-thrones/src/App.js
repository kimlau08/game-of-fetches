import React, { Component } from 'react';
import './App.css';

import axios from 'axios';

let q1URL="https://anapioficeandfire.com/api/characters/16";
let q1Ans={};
let q2URL="https://www.anapioficeandfire.com/api/houses/378";
let q2Ans={};
let q3URL="https://www.anapioficeandfire.com/api/houses/229";
let q3Ans={};
let q4URL="https://www.anapioficeandfire.com/api/houses/17";
let q4Ans={};
let q5URL="https://www.anapioficeandfire.com/api/characters/901";
let q5Ans={};
let q6URL="https://www.anapioficeandfire.com/api/houses/362";
let q6Ans={};
let q7URL="https://www.anapioficeandfire.com/api/characters/232";
let q7Ans={};

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state={answers: []}  //array of answer strings

    this.axiosGetData=this.axiosGetData.bind(this);
  }

  axiosGetData(url, idx, attr, attrElemIdx) {  
    //idx is question #, attr is response field containing anwser, 
    //attrElemIdx is idx to answer in case attr is an array
    axios.get(url)
    .then (response=> {
      let resp=response.data;
      console.log('question-answer--->', resp);

      let arr=this.state.answers;
      // use attrElemIdx to find answer string if resp[attr] is array; otherwise answer is resp[attr] 
      let attrValue=Array.isArray(resp[attr]) ? resp[attr][attrElemIdx] : resp[attr];
      arr[idx]=attrValue;   
      this.setState({answers: arr});   //setState wants to update the entire array, not just an element

    })
    .catch(error=>{
      console.log('there is an error', error)
    })
  }

  componentDidMount() {
    this.axiosGetData(q1URL, 1, 'born');
    this.axiosGetData(q2URL, 2, 'region');
    this.axiosGetData(q3URL, 3, 'coatOfArms');
    this.axiosGetData(q4URL, 4, 'seats', 1);
    this.axiosGetData(q5URL, 5, 'aliases', 1);
    this.axiosGetData(q6URL, 6, 'born');
    this.axiosGetData(q7URL, 7, 'born');
  }

  render() {
    return (
      <div className="App">
          <h1>Game of Throne Questions & Answers</h1>
            <h2>Q1. Where was Margaery Tyrell born?</h2>
            <h2>Ans: {this.state.answers[1]}</h2>
            <h2>Q2. What region is House Targaryen in?</h2>
            <h2>Ans: {this.state.answers[2]}</h2>
            <h2>Q3. What's the coat of arms of House Lannister?</h2>
            <h2>Ans: {this.state.answers[3]}</h2>
            <h2>Q4. What is the second seat of House Baratheon?</h2>
            <h2>Ans: {this.state.answers[4]}</h2>
            <h2>Q5. What is Robert Baratheon's second alias?</h2>
            <h2>Ans: {this.state.answers[5]}</h2>
            <h2>Q6. What's the name of the founder of House Stark? (You have to chain fetch requests!)</h2>
            <h2>Ans: {this.state.answers[1]}</h2>
            <h2>Q7. What are the titles of Catelyn Stark's three POV books? (Look into Promise.all to request these simultaniously)
</h2>
            <h2>Ans: {this.state.answers[1]}</h2>

      </div>
    );
  }
}

