import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
 
const env = process.env;
 
function SearchMovies() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
 
  const handleSearch = async (e) => {
    e.preventDefault();
 
    try {
      const res = await axios.post(`${env.REACT_APP_API_URL}/movies/search`, { query }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };
 
  return (
    <div className="container mt-4">
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="searchQuery">
          <Form.Label>Search for Movies or Actors</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title or actor name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">Search</Button>
      </Form>
 
      <Row className="mt-4">
        {results.map((movie, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card>
              {movie.imageUrl && (
                <Card.Img variant="top" src={movie.imageUrl} alt={movie.title} />
              )}
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>
                  Genre: {movie.genre}<br />
                  Release: {movie.releaseDate}<br />
                  Actors:
                  <ul>
                    {movie.actors.map((actor, i) => (
                      <li key={i}>{actor.actorName} as {actor.characterName}</li>
                    ))}
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
 
export default SearchMovies;