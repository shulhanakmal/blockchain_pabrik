import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import "./spinner.css";

export const Spinner = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div className="spinner">
        <Loader>
            <div className="sk-grid">
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
                <div className="sk-grid-cube"></div>
            </div>
        </Loader>
      </div>
    )
  );
};

