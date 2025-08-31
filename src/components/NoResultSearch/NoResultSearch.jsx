import React from 'react';
import Container from '../Container/Container';
import css from './NoResultSearch.module.css';

const NoResultSearch = ({ query, totalResults = 0, onReset }) => {
  return (
    <Container variant="light">
      <div className={css.wrapper}>
        <div className={css.message}>
          <p className={css.mesagetext}>
            We’re sorry! We were not able to find a match.
          </p>
          <button className={css.resetSearch} onClick={onReset}>
            Reset search and filters
          </button>
        </div>
      </div>
    </Container>
  );
};

export default NoResultSearch;
