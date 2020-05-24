import { Link } from 'react-router-dom';
import React from 'react';

const OtherPage = () => {
  return (
    <div>
      <h1>Other Page</h1>
      <Link to="/">Go Home </Link>
    </div>
  );
};

export { OtherPage };
