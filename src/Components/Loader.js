import React from "react";
import Loader from "react-loader-spinner";

const PuffLoader = () => {
  return (
    <Loader
      style={{ textAlign: "center" }}
      type="Puff"
      color="#b5b5b5"
      height={300}
      width={300}
    />
  );
};

export default PuffLoader;
