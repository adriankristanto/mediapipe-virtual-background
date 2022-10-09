import React from 'react'
import { ReactComponent as Close } from './assets/close.svg'

function SettingsModal({ open, onClose, children }) {
    return (
        open && (
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="w-full flex justify-between items-center">
                    <div className="ml-3 text-gray-700 text-lg font-bold mb-5">
                        Settings
                    </div>
                    <button className="ml-3 mb-5" onClick={onClose}>
                        <Close />
                    </button>
                </div>
                {children}
            </div>
        )
    )
}

export default SettingsModal
