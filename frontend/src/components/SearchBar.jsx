// src/components/SearchBar.js

import React, { useState } from 'react';
import axios from 'axios';

// Components for different quiz types
const MCQItem = ({ title, options }) => (
  <div>
    <strong>{title}</strong>
    <ul style={{ marginTop: '5px' }}>
      {options.map((option, index) => (
        <li key={index}>
          {String.fromCharCode(65 + index)}. {option.text}
        </li>
      ))}
    </ul>
  </div>
);

const AnagramItem = ({ title, anagramType, blocks }) => (
  <div>
    <strong>{title}</strong>
    <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
      {anagramType === 'WORD' ? 'Word Anagram' : 'Sentence Anagram'}
    </p>
    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
      {blocks.map((block, index) => (
        <span
          key={index}
          style={{
            padding: '5px 10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
          }}
        >
          {block.text}
        </span>
      ))}
    </div>
  </div>
);

const ReadAlongItem = ({ title }) => (
  <div>
    <strong>{title}</strong>
  </div>
);

const QuizItem = ({ item }) => {
  switch (item.type) {
    case 'MCQ':
      return <MCQItem title={item.title} options={item.options} />;
    case 'ANAGRAM':
      return (
        <AnagramItem
          title={item.title}
          anagramType={item.anagramType}
          blocks={item.blocks}
        />
      );
    case 'READ_ALONG':
      return <ReadAlongItem title={item.title} />;
    default:
      return null;
  }
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    setQuery(event.target.value);
    setCurrentPage(1); // Reset to page 1 when the query changes
    fetchData(event.target.value, 1);
  };

  const fetchData = async (searchQuery, page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/search', {
        params: {
          q: searchQuery,
          page: page,
          limit: 20,
        },
      });

      setResults(response.data.results);
      setTotalResults(response.data.totalResults);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (direction) => {
    let newPage = currentPage;

    if (direction === 'next' && currentPage < totalPages) {
      newPage = currentPage + 1;
    } else if (direction === 'prev' && currentPage > 1) {
      newPage = currentPage - 1;
    }

    fetchData(query, newPage);
  };

  const getTagColor = (type) => {
    switch (type) {
      case 'ANAGRAM':
        return 'lightblue';
      case 'MCQ':
        return 'lightgreen';
      case 'READ_ALONG':
        return 'lightyellow';
      default:
        return 'lightgrey';
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
      />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {results.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {results.map((item) => (
                  <li
                    key={item._id}
                    style={{
                      marginBottom: '15px',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                    }}
                  >
                    <QuizItem item={item} />
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: getTagColor(item.type),
                        color: 'black',
                      }}
                    >
                      {item.type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No results found</p>
            )}
            <div>
              <button
                onClick={() => handlePagination('prev')}
                disabled={currentPage === 1}
                style={{ marginRight: '10px' }}
              >
                Previous
              </button>
              <button
                onClick={() => handlePagination('next')}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
