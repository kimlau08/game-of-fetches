import React, { Component } from 'react';
import './App.css';

import axios from 'axios';

let q1URL="https://anapioficeandfire.com/api/characters/16";
let q2URL="https://www.anapioficeandfire.com/api/houses/378";
let q3URL="https://www.anapioficeandfire.com/api/houses/229";
let q4URL="https://www.anapioficeandfire.com/api/houses/17";
let q5URL="https://www.anapioficeandfire.com/api/characters/901";
let q6URL="https://www.anapioficeandfire.com/api/houses/362";
let q7URL="https://www.anapioficeandfire.com/api/characters/232";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state={answers: []}  //array of answer strings

    this.axiosGetData=this.axiosGetData.bind(this);
    this.chainedRequestOne=this.chainedRequestOne.bind(this);
    this.chainedRequestTwo=this.chainedRequestTwo.bind(this);
    this.simultaneousRequestsTwo=this.simultaneousRequestsTwo.bind(this);
  }

  simultaneousRequestsTwo(urls, idx, attr) {

    //launch a few ajax request simultaneously using Promise.all
    Promise.all(urls.map((url)=>
      axios.get(url)
      .then (response=> {
        let resp=response.data;
        console.log('2nd resp is in simultaneous mode--->', resp);
  
        let arr=this.state.answers;
        // use attrElemIdx to find answer string if resp[attr] is array; otherwise answer is resp[attr] 
        let attrValue=resp[attr];
        if (idx in arr) {
          arr[idx]+="; "+attrValue;   //append answer if one already exist
        } else {
          arr[idx]=attrValue;   //set the first answer
        }
        this.setState({answers: arr});   //setState wants to update the entire array, not just an element
      })
      .catch(error=>{
        console.log('there is an error', error)
      })

    ), {idx: idx, attr: attr})  //used 2nd parm (object) to pass in additionl parms

  }

  chainedRequestTwo(url, idx, attr) {

    axios.get(url)
    .then (response=> {
      let resp=response.data;
      console.log('2nd resp of chain--->', resp);

      let arr=this.state.answers;
      // use attrElemIdx to find answer string if resp[attr] is array; otherwise answer is resp[attr] 
      let attrValue=resp[attr];
      arr[idx]=attrValue;   
      this.setState({answers: arr});   //setState wants to update the entire array, not just an element

    })
    .catch(error=>{
      console.log('there is an error', error)
    })
  }


  chainedRequestOne(url, idx, attr, nextAttr) { //first request of a chain of 2 requests
    //idx is question #, attr is response field containing anwser  
    //nextAttr is the response field in the next request that will contain answer

    axios.get(url)
    .then (response=> {
      let resp=response.data;
      console.log('1st resp of chain--->', resp);

      let nextURL=resp[attr]; //expecting an URL or array of URL
      
      //Use simulaneous requests if an array of URLs is returned
      if (Array.isArray(nextURL)) {
        this.simultaneousRequestsTwo(nextURL, idx, nextAttr)
      } else {
        this.chainedRequestTwo(nextURL, idx, nextAttr);
      }
    })
    .catch(error=>{
      console.log('there is an error', error)
    })

  }

  axiosGetData(url, idx, attr, attrElemIdx, chainedRequest, nextAttr) {  
    //idx is question #, attr is response field containing anwser, 
    //attrElemIdx is idx to answer in case attr is an array
    //chainedRequest causes a cascade of requests to find answer
    
    if (chainedRequest) {

      //It is a chained requests. Start with request one
      this.chainedRequestOne(url, idx, attr, nextAttr);

    } else {

      //It is a singular request
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

  }

  componentDidMount() {

    //Lanuch requests for all 7 questions
    this.axiosGetData(q1URL, 1, 'born');
    this.axiosGetData(q2URL, 2, 'region');
    this.axiosGetData(q3URL, 3, 'coatOfArms');
    this.axiosGetData(q4URL, 4, 'seats', 1);   //get 2nd elem of an array
    this.axiosGetData(q5URL, 5, 'aliases', 1); //get 2nd elem of an array
    this.axiosGetData(q6URL, 6, 'founder', 0, true, 'name'); //chain to one more get request, last parm is the attr name for 2nd response that contains answer
    this.axiosGetData(q7URL, 7, 'povBooks', 0, true, 'name');
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
            <h2>Ans: {this.state.answers[6]}</h2>
            <h2>Q7. What are the titles of Catelyn Stark's three POV books? (Look into Promise.all to request these simultaniously)</h2>
            <h2>Ans: {this.state.answers[7]}</h2>

      </div>
    );
  }
}

