import React, { useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'
import { Camera } from '@mediapipe/camera_utils'
import './App.css'

const App = () => {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
            },
        })
        selfieSegmentation.setOptions({
            modelSelection: 1,
        })
        selfieSegmentation.onResults(onResults)

        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null
        ) {
            const camera = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await selfieSegmentation.send({
                        image: webcamRef.current.video,
                    })
                },
                width: 1280,
                height: 720,
            })
            camera.start()
        }
    }, [])

    const onResults = (results) => {
        // the following two lines of code fix the resolution of the canvas
        canvasRef.current.width = webcamRef.current.video.clientWidth
        canvasRef.current.height = webcamRef.current.video.clientHeight

        const canvasCtx = canvasRef.current.getContext('2d')
        // https://stackoverflow.com/questions/50681592/getusermedia-mirror-image-instead-of-flip
        canvasCtx.setTransform(-1, 0, 0, 1, canvasRef.current.width, 0)
        canvasCtx.save()
        canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        )
        canvasCtx.drawImage(
            results.segmentationMask,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        )

        // draw the part of the raw image that overlaps with the segmentation mask (the person)
        canvasCtx.globalCompositeOperation = 'source-in'
        canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        )

        // draw the part of the raw image that does not overlap with the segmentation mask (the background)
        canvasCtx.globalCompositeOperation = 'destination-over'
        canvasCtx.filter = 'blur(16px)'
        canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        )
        canvasCtx.restore()
    }

    return (
        <div>
            <Webcam
                ref={webcamRef}
                className="absolute ml-auto mr-auto left-0 right-0 text-center min-h-full"
                mirrored
            />
            <canvas
                ref={canvasRef}
                className="absolute ml-auto mr-auto left-0 right-0 text-center min-h-full"
            />
        </div>
    )
}

export default App
