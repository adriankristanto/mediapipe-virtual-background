import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import "./App.css";

const App = () => {
    const webcamRef = useRef(null);
    // https://stackoverflow.com/questions/17976995/how-to-center-absolute-div-horizontally-using-css
    const style = {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 1,
        minHeight: "100%",
    };

    return (
        <div>
            <Webcam ref={webcamRef} style={style} mirrored />
        </div>
    );
};

export default App;
