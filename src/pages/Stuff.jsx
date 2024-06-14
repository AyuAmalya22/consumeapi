import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Case from "../components/Case";
import Table from "../components/Table";
import ModalDelete from "../components/ModalDelete";
import ModalEdit from "../components/ModalEdit"; // Import ModalEdit

export default function Stuffs() {
    const [stuffs, setStuffs] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteItemName, setDeleteItemName] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false); // State for Edit Modal
    const [editItemData, setEditItemData] = useState(null); // State to hold data for Edit

    //setStuffs= buat nampung
    //useState= menampilkan
    //useNavigate/ Navigate = untuk menavigasi
    //useEffect = menjalankan suatu aksi/ 

    const navigate = useNavigate();

    useEffect(() => {
        getStuffs();
    }, []);

    function getStuffs() {
        axios.get('http://localhost:8000/stuffs', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setStuffs(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            }
        });
    }

    const handleDelete = (id, name) => {
        setShowDeleteModal(true);
        setDeleteItemId(id);
        setDeleteItemName(name);
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:8000/stuffs/delete/${deleteItemId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            getStuffs();
            setShowDeleteModal(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const handleEdit = (item) => {
        setEditItemData(item);
        setShowEditModal(true);
    };
 
    const confirmEdit = (updatedData) => {
        axios.put(`http://localhost:8000/stuffs/update/${editItemData.id}`, updatedData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            getStuffs();
            setShowEditModal(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const headers = [
        "#",
        "Name",
        "Category",
        "Total Available",
        "Total Defect"
    ];
    const endpointModal = {
        "data_detail": "http://localhost:8000/stuffs/{id}",
        "delete": "http://localhost:8000/stuffs/delete/{id}",
        "update": "http://localhost:8000/stuffs/update/{id}",
        "store" : "http//localhost:8000/stuffs/store",
   
    };

    const columnIdentitasDelete = 'name';

    const inputData = {
        "name" : {
            "tag": "input",
            "type": "text",
            "option": null
        },

        "category" : {
            "tag": "select",
            "type": "select",
            "option": ["KLN", "HTL", "Technical/Facilities"]
        },

    }

    const title = 'Stuff'

    const buttons = [
        "create",
        "trash",
        "edit",
        "delete"
    ]

   const tdColumn = {
    "name": null,
    "category": null,
    "stuff_stock": "total_available",
    "stuff_stock*": "total_defec"
   } 

    return (
        <Case>
            <div className="mt-20">
                <h1 className="text-center text-white">Data Stuffs</h1>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-20 py-10">
                <Table
                    headers={headers} data={stuffs} endpoint={endpointModal} onDelete={handleDelete} onEdit={handleEdit} inputData={inputData} identitasColumn={columnIdentitasDelete} opsiButton={buttons} columnForTd={tdColumn}></Table>
                {showDeleteModal && (
                    <ModalDelete
                        onDelete={confirmDelete}
                        onClose={() => setShowDeleteModal(false)}
                        itemName={deleteItemName}
                    />
                )}
                {showEditModal && (
                    <ModalEdit
                        itemData={editItemData}
                        onEdit={confirmEdit}
                        onClose={() => setShowEditModal(false)}
                        inputData={inputData}
                    />
                )}
            </div>
        </Case>
    );
}
