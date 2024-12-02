import React from "react";
import { Table, Button } from "react-bootstrap";

function DataTable({ data, onDelete }) {
  if (data.length === 0) {
    return <p>No data to display</p>;
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, idx) => (
              <td key={idx}>{value}</td>
            ))}
            <td>
              <Button variant="danger" onClick={() => onDelete(index)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;
