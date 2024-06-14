import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import ModalDelete from './ModalDelete';
import ModalEdit from './ModalEdit';

export default function Table({ headers, data, endpoint, inputData, titleModal, identitasColumn, opsiButton, columnForTd }) {
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [endpointToSend, setEndpointToSend] = useState({});
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const navigate = useNavigate();

    function handleModalDelete(id) {
        console.log(`Delete button clicked for ID: ${id}`);
        const endpointDelete = endpoint['delete'];
        const endpointDetail = endpoint['data_detail'];
        const replaceUrlDelete = endpointDelete.replace("{id}", id);
        const replaceUrlDetail = endpointDetail.replace("{id}", id);
        const endpointReplaced = {
            "data_detail": replaceUrlDetail,
            "delete": replaceUrlDelete,
        };
        setEndpointToSend(endpointReplaced);
        setIsModalDeleteOpen(true);
    }

    function handleModalEdit(id) {
        console.log(`Edit button clicked for ID: ${id}`);
        const endpointUpdate = endpoint['update'];
        const endpointDetail = endpoint['data_detail'];
        const replaceUrlUpdate = endpointUpdate.replace("{id}", id);
        const replaceUrlDetail = endpointDetail.replace("{id}", id);
        const endpointReplaced = {
            "data_detail": replaceUrlDetail,
            "update": replaceUrlUpdate,
        };
        setEndpointToSend(endpointReplaced);
        setIsModalEditOpen(true);
    }

    function handleModalAdd() {
        const endpointToSend = {
            "store": endpoint['store'],
        };
        setEndpointToSend(endpointToSend);
        setIsModalAddOpen(true);
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-20 py-10">
            <div className="flex justify-end">
                {opsiButton.includes("create") && (
                    <button type="button" onClick={handleModalAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mb-5">Create</button>
                )}
                {opsiButton.includes("trash") && (
                    <Link to={'/stuffs/trash'} className="inline-flex items-center px-4 py-2 text-sm ml-3 font-medium text-center text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 mb-5">Trash</Link>
                )}
            </div>
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
                    {data.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                            <td className="px-6 py-4">{item.name}</td>
                            <td className="px-6 py-4">{item.category}</td>
                            <td className="px-6 py-4">{item.total_available}</td>
                            <td className="px-6 py-4">{item.total_defect}</td>
                            <td className="px-6 py-4 flex space-x-4">
                                {opsiButton.includes("edit") && (
                                    <button
                                        className="text-blue-600 hover:text-blue-900"
                                        onClick={() => handleModalEdit(item.id)}
                                    >
                                        Edit
                                    </button>
                                )}
                                {opsiButton.includes("delete") && (
                                    <button
                                        type="button" onClick={() => handleModalDelete(item.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline ml-3">
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalDeleteOpen && (
                <ModalDelete
                    isOpen={isModalDeleteOpen}
                    onClose={() => setIsModalDeleteOpen(false)}
                    endpoint={endpointToSend}
                    identitasColumn={identitasColumn}
                />
            )}

            {isModalEditOpen && (
                <ModalEdit
                    isOpen={isModalEditOpen}
                    onClose={() => setIsModalEditOpen(false)}
                    endpoint={endpointToSend}
                    inputData={inputData}
                    titleModal={titleModal}
                />
            )}
        </div>
    );
}
