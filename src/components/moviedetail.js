import React, { useEffect } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom'; // Import useParams
const env = process.env;
 
 
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';
 
const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams(); // Get movieId from URL parameters
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); // Assuming you have a loading state in your reducer
  const error = useSelector(state => state.movie.error); // Assuming you have an error state in your reducer
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
 
  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);
 
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reviews`, {
        movieId: selectedMovie._id,
        review: comment,
        rating: Number(rating)
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
 
      alert("Review submitted!");
      window.location.reload(); // or re-fetch movie data
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    }
  };
 
  const DetailInfo = () => {
    if (loading) {
      return <div>Loading....</div>;
    }
 
    if (error) {
      return <div>Error: {error}</div>;
    }
 
    if (!selectedMovie) {
      return <div>No movie data available.</div>;
    }
 
    return (
      <Card className="bg-dark text-dark p-4 rounded">
        <Card.Header>Movie Detail</Card.Header>
        <Card.Body>
          <Image className="image" src={selectedMovie.imageUrl} thumbnail />
        </Card.Body>
        <ListGroup>
          <ListGroupItem>{selectedMovie.title}</ListGroupItem>
          <ListGroupItem>
            {selectedMovie.actors.map((actor, i) => (
              <p key={i}>
                <b>{actor.actorName}</b> {actor.characterName}
              </p>
            ))}
          </ListGroupItem>
          <ListGroupItem>
            <h4>
              <BsStarFill /> {selectedMovie.avgRating}
            </h4>
          </ListGroupItem>
        </ListGroup>
        <Card.Body className="card-body bg-white">
          {selectedMovie.reviews.map((review, i) => (
            <p key={i}>
              <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
              {review.rating}
            </p>
          ))}
        </Card.Body>
      </Card>
    );
  };
 
  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header>Movie Detail</Card.Header>
      <Card.Body>
        <Image className="image" src={selectedMovie.imageUrl} thumbnail />
      </Card.Body>
      <ListGroup>
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>
        <ListGroupItem>
          {selectedMovie.actors.map((actor, i) => (
            <p key={i}>
              <b>{actor.actorName}</b> {actor.characterName}
            </p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4>
            <BsStarFill /> {selectedMovie.avgRating}
          </h4>
        </ListGroupItem>
      </ListGroup>
 
      {/* Review List Section */}
      <Card.Body className="card-body bg-white">
        {selectedMovie.reviews.map((review, i) => (
          <p key={i}>
            <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
            {review.rating}
          </p>
        ))}
      </Card.Body>
 
      {/* Review Form Below This */}
      <Card className="mt-4 p-3">
        <Form onSubmit={handleReviewSubmit}>
          <Form.Group>
            <Form.Label>Rating (1–5)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit Review
          </Button>
        </Form>
      </Card>
    </Card>
  );
 
};
 
 
export default MovieDetail;