import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Camera } from "@mediapipe/camera_utils";
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

    useEffect(() => {
        const selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            },
        });
        selfieSegmentation.setOptions({
            modelSelection: 1,
        });
        selfieSegmentation.onResults(onResults);

        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
        ) {
            const camera = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await selfieSegmentation.send({
                        image: webcamRef.current.video,
                    });
                },
                width: 1280,
                height: 720,
            });
            camera.start();
        }
    }, []);

    const onResults = (results) => {
        console.log(results);
    };

    return (
        <div>
            <Webcam ref={webcamRef} style={style} mirrored />
        </div>
    );
};

export default App;
