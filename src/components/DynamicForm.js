import React, { useState } from "react";
import { Form, Button, Alert, ProgressBar, Table } from "react-bootstrap";
import apiService from "../services/apiServices";
import "../styles/form.css";

function DynamicForm() {
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTypeChange = (event) => {
    setFormType(event.target.value);
    setFormData({});
    setErrors({});
    setProgress(0);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Validate age for negative numbers and non-numeric values
    if (name === "age" && (value < 0 || isNaN(value))) {
      setErrors({
        ...errors,
        age: "Age must be a valid number and cannot be negative",
      });
      return;
    } else if (name === "age") {
      setErrors({ ...errors, age: null });
    }

    setFormData({ ...formData, [name]: value });
    calculateProgress();
  };

  const calculateProgress = () => {
    const fields = apiService[formType]?.fields || [];
    const completedFields = fields.filter((field) => formData[field.name]);
    setProgress((completedFields.length / fields.length) * 100);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const fields = apiService[formType]?.fields || [];
    const validationErrors = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        validationErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setSubmittedData([...submittedData, formData]);
      setFormData({});
      setErrors({});
      setProgress(0);
      setSuccessMessage("Form submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDelete = (index) => {
    const updatedData = [...submittedData];
    updatedData.splice(index, 1);
    setSubmittedData(updatedData);
  };

  const isFormValid =
    Object.keys(errors).length === 0 && formType && progress === 100;

  return (
    <div className="form-container">
      <Form>
        <Form.Group controlId="formType">
          <Form.Label>Select Form Type</Form.Label>
          <Form.Control
            as="select"
            value={formType}
            onChange={handleTypeChange}
          >
            <option value="">-- Select Form Type --</option>
            {Object.keys(apiService).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {formType &&
          apiService[formType]?.fields.map((field) => (
            <Form.Group key={field.name} controlId={field.name}>
              <Form.Label>{field.label}</Form.Label>
              {field.type === "dropdown" ? (
                <Form.Control
                  as="select"
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                />
              )}
              {errors[field.name] && (
                <Alert variant="danger">{errors[field.name]}</Alert>
              )}
            </Form.Group>
          ))}

        {progress > 0 && (
          <ProgressBar
            now={progress}
            label={`${Math.round(progress)}%`}
            className="mb-3"
          />
        )}

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Submit
        </Button>
      </Form>

      {successMessage && (
        <Alert variant="success" className="mt-3">
          {successMessage}
        </Alert>
      )}

      {submittedData.length > 0 ? (
        <div className="table-container mt-5">
          <Table striped bordered hover>
            <thead>
              <tr>
                {Object.keys(submittedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="info">No data submitted yet.</Alert>
      )}
    </div>
  );
}

export default DynamicForm;
