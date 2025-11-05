import React from "react";

/**
 * A simple loader component that displays a CSS-based animation.
 */
const Loader = () => {
  return (
    <>
      {/* This style tag contains the CSS for the loader animation.
        In a larger React application, this would typically be in a separate .css file.
      */}
      <style>
        {`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .loader {
            width: 70px;
            height: 60px;
            --m: no-repeat linear-gradient(90deg, #000 70%, #0000 0);
            -webkit-mask: 
              var(--m) calc(0*100%/4) 100%/calc(100%/5) calc(1*100%/5),
              var(--m) calc(1*100%/4) 100%/calc(100%/5) calc(2*100%/5),
              var(--m) calc(2*100%/4) 100%/calc(100%/5) calc(3*100%/5),
              var(--m) calc(3*100%/4) 100%/calc(100%/5) calc(4*100%/5),
              var(--m) calc(4*100%/4) 100%/calc(100%/5) calc(5*100%/5);
            background: linear-gradient(#514b82 0 0) left/0% 100% no-repeat #ddd;
            animation: l14 2s infinite steps(6);
          }
          @keyframes l14 {
            100% {background-size: 120% 100%}
          }
        `}
      </style>

      {/* This is the HTML element that the CSS above styles.
        We wrap it in a container to center it, similar to the previous loader.
      */}
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    </>
  );
};

export default Loader;
