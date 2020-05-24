import React from 'react';
import axios from 'axios';

export const Fib = () => {
  const [seenIndexes, setSeenIndexes] = React.useState([]);
  const [values, setValues] = React.useState({});

  const calculateValue = async (value) => {
    await axios.post('/api/values', { value });
  };

  React.useEffect(() => {
    const fetchValues = async () => {
      const response = await axios.get('/api/values/current');

      setValues(response.data);
    };

    const fetchIndexes = async () => {
      const response = await axios.get('/api/values/all');

      setSeenIndexes(response.data);
    };

    fetchValues();
    fetchIndexes();

    return () => {
      // cleanup here
    };
  }, []);

  const renderSeenIndexes = () => {
    return (
      <ul>
        {seenIndexes.map(({number}, index) => (
          <li key={index}>{number}</li>
        ))}
      </ul>
    );
  };

  const renderCalculatedValues = () => {
    return (
      <ul>
        {Object.keys(values).map((key) => (
          <li key={key}>
            For index {key} I calculated {values[key]}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Fibonacci Calculator</h1>
      <Form onSubmit={calculateValue} />

      <div>
        <h2>Indicies I have seen:</h2>
        {renderSeenIndexes()}
      </div>

      <div>
        <h2>Calculated values:</h2>
        {renderCalculatedValues()}
      </div>
    </div>
  );
};

export const Form = ({ onSubmit }) => {
  const [value, setValue] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Calculate</button>
    </form>
  );
};
