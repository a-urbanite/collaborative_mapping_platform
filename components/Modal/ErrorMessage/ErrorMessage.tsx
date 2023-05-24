import React from "react";
import { useRouter } from "next/router";
import { RxCross1 } from "react-icons/rx";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({message}: ErrorMessageProps) => {
  const router = useRouter()

  return (
    <>
      <h1>Error!</h1>
      <RxCross1 />
      <p>{message}</p>
      <button onClick={() => router.reload()}>Reload Page</button>
    </>
  );
};

export default ErrorMessage;
