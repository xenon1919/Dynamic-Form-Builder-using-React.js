import React from "react";
import { ProgressBar as BootstrapProgressBar } from "react-bootstrap";

function ProgressBar({ progress }) {
  return (
    <div>
      <BootstrapProgressBar now={progress} label={`${progress.toFixed(0)}%`} />
    </div>
  );
}

export default ProgressBar;
