import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Infinite from 'react-infinite';
import 'whatwg-fetch';
import Dataset  from 'impagination';

const ITEM_HEIGHT = 250;
const HEADER_HEIGHT = 190;

class App extends Component {
  static state = {
    dataset: null,
    datasetState: null,
  }

  setupImpagination() {
    let _this = this;

    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 45,

      // Anytime there's a new state emitted, we want to set that on
      // the componets local state.
      observe(datasetState) {
        _this.setState({datasetState});
      },

      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return fetch(`https://serene-beach-38011.herokuapp.com/api/faker?page=${pageOffset + 1}&per_page=${pageSize}`)
          .then(response => response.json())
          .catch((error) => {
            console.error(error);
          });
      }
    });

    dataset.setReadOffset(0);
    this.setState({dataset});
  }

  componentWillMount() {
    this.setupImpagination();
  }

  setCurrentReadOffset = (event) => {
    let currentItemIndex = Math.ceil((window.scrollY - HEADER_HEIGHT) / ITEM_HEIGHT);

    this.state.dataset.setReadOffset(currentItemIndex);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Impagination</h2>
        </div>
        <Infinite containerHeight={400} elementHeight={250} handleScroll={this.setCurrentReadOffset} useWindowAsScrollContainer>
          {this.state.datasetState.map(record => {
            if(record.isPending && !record.isSettled) {
              return <div key={Math.random()}>Loading...</div>;
            }
            return (
              <div key={record.content.id} style={{height: "250px", backgroundColor: '#ddd'}}>
                {record.content.title}
                <img src={record.content.image} style={{display: "block", height: "200px", margin: "0 auto"}} alt={record.content.title} />
              </div>
            );
          })}
        </Infinite>
      </div>
    );
  }
}

export default App;
