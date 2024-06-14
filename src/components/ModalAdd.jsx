import axios from "axios";
import React, { useState } from "react";

export default function ModalAdd({ isOpen, onClose, endpoint, inputData, titleModal }) {
    if (!isOpen) {
        return null;
    }

    const [payload, setPayload] = useState({});
    const [error, setError] = useState([]);

    function handleInputChange(e) {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setPayload(prevDataDetail => ({
                ...prevDataDetail,
                [name]: files[0]
            }));
        } else {
            setPayload(prevDataDetail => ({
                ...prevDataDetail,
                [name]: value
            }));
        }

        const errors = validateInput({ ...payload, [name]: value });
        setError(errors);
    }

    async function handleStore() {
        try {
            const stuffPayload = {
                name: payload.name,
                category: payload.category,
                total_available: payload.total_available,
                total_defec: payload.total_defec,
            };

            const stuffResponse = await axios.post(
                endpoint["storeStuff"],
                stuffPayload,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("access_token"),
                    },
                }
            );

            if (!stuffResponse.data) {
                throw new Error(`Error creating stuff data`);
            }

            const newStuffId = stuffResponse.data.id;

            const inboundPayload = new FormData();
            inboundPayload.append('stuff_id', newStuffId);
            inboundPayload.append('total', payload.total);
            inboundPayload.append('date', payload.date);
            inboundPayload.append('proff_file', payload.proff_file);

            const inboundResponse = await axios.post(
                endpoint["storeInbound"],
                inboundPayload,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("access_token"),
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            if (!inboundResponse.data) {
                throw new Error(`Error creating inbound data`);
            }

            onClose();
        } catch (error) {
            console.error("Failed to create data:", error);
            setError([error.message]);
        }
    }

    return (
        <div id="crud-modal-add" tabIndex="-1" aria-hidden="true"
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Add New {titleModal}
                        </h3>
                        <button type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={onClose}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    {error.length > 0 && (
                        <div role="alert">
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Gagal!
                            </div>
                            <div className="border border-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                <ul>
                                    {error.map((err, index) => (
                                        <li key={index}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <form className="p-4 md:p-5">
                        {Object.entries(inputData).map(([index, item]) => (
                            <div className="mb-6" key={index}>
                                {item.tag === "select" ? (
                                    <>
                                        <label htmlFor={index} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{index}</label>
                                        <select id={index} name={index} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleInputChange}>
                                            {item.option.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor={index} className="block text-sm font-medium text-gray-900 dark:text-white capitalize mb-3">{index}</label>
                                        <input type={item.type} name={index} id={index} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
                                            rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleInputChange} />
                                    </>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={handleStore} disabled={error.length > 0}
                            className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            <svg className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                            Create {titleModal}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function validateInput(input) {
    const errors = [];
    if (!input.name) {
        errors.push("Name is required");
    }
    return errors;
}
