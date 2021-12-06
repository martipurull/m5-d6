import React, { Component } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Container, Form, Button, Text } from "react-bootstrap";
import "./styles.css";
export default class NewBlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      category: "",
      author: {
        name: "",
      },
      content: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(fieldKey, value) {
    this.setState({
      ...this.state,
      [fieldKey]: value
    });
  }

  async handleSubmit() {
    try {
      const response = await fetch(`${ process.env.REACT_APP_HEROKU }/blogPosts`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(this.state)
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <Container className="new-blog-container">
        <Form className="mt-5">
          <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Author</Form.Label>
            <Form.Control size="lg" placeholder="Author's name" value={this.state.author.name} onChange={(e) => this.handleChange("author", e.target.value)} />
          </Form.Group>
          <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control size="lg" placeholder="Title" value={this.state.title} onChange={(e) => this.handleChange("title", e.target.value)} />
          </Form.Group>
          <Form.Group controlId="blog-category" className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control size="lg" as="select" value={this.state.category} onChange={(e) => this.handleChange("category", e.target.value)}>
              <option>Life</option>
              <option>Self-development</option>
              <option>Tech</option>
              <option>Blockchain</option>
              <option>True crime</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="blog-content" className="mt-3">
            <Form.Label>Blog Content</Form.Label>
            <ReactQuill
              value={this.state.content}
              onChange={(html) => this.handleChange("content", html)}
              className="new-blog-content"
            />
          </Form.Group>
          <Form.Group className="d-flex mt-3 justify-content-end">
            <Button type="reset" size="lg" variant="outline-dark">
              Reset
            </Button>
            <Button
              onClick={this.handleSubmit}
              size="lg"
              variant="dark"
              style={{ marginLeft: "1em" }}
            >
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
