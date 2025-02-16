import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";

function App() {
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:8000"; 

  useEffect(() => {
    axios
      .get(`${API_URL}/events`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        alert("Failed to load events. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter your email before subscribing.");
      return;
    }
  
    axios
      .post("http://localhost:8000/subscribe", {
        email: email,
        event_id: selectedEvent.id, 
      })
      .then(() => {
        alert("Subscribed successfully!");
        window.location.href = selectedEvent.link;
      })
      .catch((error) => {
        console.error("Error subscribing:", error);
        alert("Subscription failed. Please try again.");
      });
  };
  

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">📍 Events in Sydney</h1>

      {loading ? (
        <p className="text-center text-primary">Loading events...</p>
      ) : events.length > 0 ? (
        <Row>
          {events.map((event) => (
            <Col key={event.id} md={6} lg={4} className="mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="text-muted">{event.date}</p>
                  <p className="card-text">{event.description}</p>
                  <Button
                    variant="primary"
                    onClick={() => setSelectedEvent(event)}
                  >
                    GET TICKETS
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-danger">No events available.</p>
      )}

      {/* ✅ Bootstrap Modal for Email Subscription */}
      <Modal show={!!selectedEvent} onHide={() => setSelectedEvent(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedEvent(null)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubscribe}>
            Subscribe & Proceed
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Footer */}
      <footer className="text-center text-muted py-4">
        &copy; {new Date().getFullYear()} Event Scraper | Built with ❤️ in React
      </footer>
    </Container>
  );
}

export default App;
