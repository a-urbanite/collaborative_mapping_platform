import React from "react";
import LoadingSpin from "react-loading-spin";

interface LoadingSpinnerProps {
  message: string
}

const LoadingSpinner = ({message}: LoadingSpinnerProps) => {
  return (
    <>
      <h1>Loading...</h1>
      <LoadingSpin />
      <p>{message}</p>
    </>
  );
};

export default LoadingSpinner;
