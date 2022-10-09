import React, { useRef, useEffect, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'
import { Camera } from '@mediapipe/camera_utils'
import { ReactComponent as Settings } from './assets/settings.svg'
import SettingsModal from './SettingsModal'
import Toggle from './Toggle'
import './App.css'

const App = () => {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const [showModal, toggleModal] = useState(false)
    const [settings, setSettings] = useState({
        blur: false,
        zoom: false,
    })

    const openModal = () => {
        toggleModal(true)
    }

    const closeModal = () => {
        toggleModal(false)
    }

    const updateSettings = (newSettingsGenerator) => {
        setSettings(newSettingsGenerator)
    }

    const onResults = useCallback(
        (results) => {
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
            if (settings.blur) {
                canvasCtx.filter = 'blur(16px)'
            }
            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            )
            canvasCtx.restore()
        },
        [settings]
    )

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
    }, [onResults])

    return (
        <div className="flex justify-center items-center min-h-screen min-w-screen bg-black">
            <Webcam ref={webcamRef} className="absolute opacity-0" mirrored />
            <canvas
                ref={canvasRef}
                className={`absolute text-center min-h-full ${
                    settings.zoom && 'min-w-full'
                }`}
            />
            <button
                className="absolute right-0 top-0 mt-2 ml-2"
                onClick={openModal}
            >
                <Settings
                    className={`${settings.zoom ? 'fill-black' : 'fill-white'}`}
                />
            </button>
            <SettingsModal
                open={showModal}
                onClose={closeModal}
                onSettingChange={updateSettings}
            >
                <Toggle
                    value={settings.blur}
                    onChange={() =>
                        updateSettings((oldSettings) => ({
                            ...oldSettings,
                            blur: !oldSettings.blur,
                        }))
                    }
                >
                    Blur my background
                </Toggle>
                <Toggle
                    value={settings.zoom}
                    onChange={() =>
                        updateSettings((oldSettings) => ({
                            ...oldSettings,
                            zoom: !oldSettings.zoom,
                        }))
                    }
                >
                    Zoom in
                </Toggle>
            </SettingsModal>
        </div>
    )
}

export default App
