import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Case from "../components/Case";
import ModalDelete from "../components/ModalDelete";
import ModalAdd from "../components/ModalAdd";

export default function InboundStuffs() {
    const [inboundStuffs, setInboundStuffs] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        handleInboundStuffs();
    }, []);

    const handleInboundStuffs = () => {
        axios.get('http://localhost:8000/inbound-stuffs/data', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setInboundStuffs(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            }
        });
    };

    const handleDelete = (id) => {
        setShowDeleteModal(true);
        setDeleteItemId(id);
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:8000/inbound-stuffs/delete/${deleteItemId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            handleInboundStuffs();
            setShowDeleteModal(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const handleAdd = (newStuff) => {
        const formData = new FormData();
        formData.append('stuff_id', newStuff.stuff_id);
        formData.append('total', newStuff.total);
        formData.append('date', newStuff.date);
        formData.append('proff_file', newStuff.proff_file);

        axios.post('http://localhost:8000/inbound-stuffs/store', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            handleInboundStuffs();
            setShowAddModal(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const headers = [
        "stuff_id",
        "total",
        "date",
        "proff_file"
    ];

    const inputData = {
        "stuff_id" : {
            "tag": "input",
            "type": "text",
            "option": null
        },
        "total" : {
            "tag": "input",
            "type": "number",
            "option": null
        },
        "date" : {
            "tag": "input",
            "type": "date",
            "option": null
        },
        "proff_file" : {
            "tag": "input",
            "type": "file",
            "option": null
        },
    };

    const title = 'Inbound Stuff';

    const buttons = [
        "delete"
    
    ];

    return (
        <Case>
            <div className="mt-20">
                <h1 className="text-center text-white">Data Inbound Stuffs</h1>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-20 py-10">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={() => setShowAddModal(true)}
                >
                    Add New Inbound Stuff
                </button>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {headers.map((header, index) => (
                                <th scope="col" className="px-6 py-3" key={index}>{header}</th>
                            ))}
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inboundStuffs.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.stuff_id}</td>
                                <td className="px-6 py-4">{item.total}</td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4">
                                    <a href={item.proff_file} target="_blank" rel="noopener noreferrer" className="text-blue-600">   
                                        View File
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                    {buttons.includes("delete") && (
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDelete(item.stuff_id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showDeleteModal && (
                    <ModalDelete
                        onDelete={confirmDelete}
                        onClose={() => setShowDeleteModal(false)}
                        itemName={deleteItemId}
                    />
                )}
                {showAddModal && (
                    <ModalAdd
                        onSave={handleAdd}
                        onClose={() => setShowAddModal(false)}
                        inputData={inputData}
                    />
                )}
            </div>
        </Case>
    );
}



        