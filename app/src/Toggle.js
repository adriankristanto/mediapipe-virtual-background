import React from 'react'

function Toggle({ onChange, children, value }) {
    return (
        <div class="flex w-full mb-2">
            <label className="flex items-center cursor-pointer">
                <div class="relative">
                    <input
                        type="checkbox"
                        className="sr-only"
                        onChange={onChange}
                    />

                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div
                        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                            value && 'translate-x-full bg-green-400'
                        }`}
                    ></div>
                </div>
                <div class="ml-3 text-gray-700 font-medium">{children}</div>
            </label>
        </div>
    )
}

export default Toggle
