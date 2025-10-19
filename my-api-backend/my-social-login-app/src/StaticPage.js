import React from 'react';

const StaticPage = ({ title }) => {
  return (
    <div style={{ padding: 24 }}>
      <h2>{title}</h2>
      <p>This is a placeholder page for "{title}". Replace with real content as needed.</p>
    </div>
  );
};

export default StaticPage;
