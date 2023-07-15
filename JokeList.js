import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

const JokeList = () => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const numJokesToGet = 5;

  useEffect(() => {
    getJokes();
  }, []);

  const getJokes = async () => {
    try {
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        let res = await axios.get('https://icanhazdadjoke.com', {
          headers: { Accept: 'application/json' }
        });

        let { id, joke } = res.data;

        if (!seenJokes.has(id)) {
          seenJokes.add(id);
          jokes.push({ id, joke, votes: 0 });
        } else {
          console.log('duplicate found!');
        }
      }

      setJokes(jokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const vote = (id, delta) => {
    setJokes(prevJokes =>
      prevJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  const renderJokes = sortedJokes.map(j => (
    <Joke
      key={j.id}
      id={j.id}
      text={j.joke}
      votes={j.votes}
      vote={vote}
    />
  ));

  return (
    <div className="JokeList">
      {isLoading ? (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      ) : (
        <>
          <button className="JokeList-getmore" onClick={getJokes}>
            Get New Jokes
          </button>
          {renderJokes}
        </>
      )}
    </div>
  );
};

export default JokeList;

