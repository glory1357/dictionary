import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';

import { fetchWord, storeClear } from '../../actions/index';
import Spinner from '../spinner/Spinner';
import Page404 from '../404/404';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './resultPage.scss';

function ResultPage() {
  const { wordKey } = useParams();
  const dispatch = useDispatch();
  const { dataWord, wordLoadingStatus, fetchingError } = useSelector((state) => state);

  useEffect(() => {
    if (!dataWord.word) {
      dispatch(fetchWord(wordKey));
    }
  }, [wordKey]);

  if (wordLoadingStatus) {
    return <Spinner />;
  }

  if (fetchingError === 404) {
    return <Page404 />;
  }
  if (fetchingError) {
    return <ErrorMessage />;
  }

  return (
    dataWord.word ? <Content data={dataWord} dispatch={dispatch} /> : null
  );
}

function Content({ data, dispatch }) {
  const { word, phonetics, meanings } = data;

  const contentPhonetics = phonetics.map(({ text, audio }) => (
    <div key={nanoid()}>
      <p>
        {text}
      </p>
      {audio ? <audio src={audio} controls><track kind="captions" /></audio> : null}
    </div>
  ));

  const contentMeanings = meanings.map(({ partOfSpeech, definitions }) => {
    const {
      definition, example, synonyms, antonyms,
    } = definitions[0];
    return (
      <div key={nanoid()} className="meanings-wrapper-definitions">
        <h4>
          PartOfSpeech:
          <span>
            {partOfSpeech}
          </span>
        </h4>
        <h4>Definitions:</h4>
        {definition ? (
          <div>
            <h5>definition: </h5>
            <p>{definition}</p>
          </div>
        ) : null}
        {example ? (
          <div>
            <h5>example:</h5>
            <p>{example}</p>
          </div>
        ) : null}
        {synonyms.length ? (
          <div>
            <h5>synonyms:</h5>
            <ul>{synonyms.map((elem) => <li key={nanoid()}>{elem}</li>)}</ul>
          </div>
        ) : null}
        {antonyms.length ? (
          <div>
            <h5>antonyms:</h5>
            <ul>{antonyms.map((elem) => <li key={nanoid()}>{elem}</li>)}</ul>
          </div>
        ) : null}
      </div>
    );
  });

  return (
    <div>
      <Link to="/" onClick={() => dispatch(storeClear())} className="button button__secondary_result">
        <div className="inner">На главную</div>
      </Link>
      <h2>{word}</h2>
      <hr />
      <div className="phonetics">
        <h3>Phonetics:</h3>
        {contentPhonetics}
      </div>
      <hr />
      <div className="meanings">
        <h3>Meanings:</h3>
        <div className="meanings-wrapper">{contentMeanings}</div>
      </div>
    </div>
  );
}

// const setContent = (process, Component, data) => {
//     switch (process) {
//         case 'loading':
//             return <Spinner/>
//         case 'confirmed':
//             return <Component data={data}/>
//         case "error":
//             return <Page404/>
//         default:
//             return <Spinner/>
//     }
// }

export default ResultPage;
