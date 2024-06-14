import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import Case from "../components/Case";
import axios from "axios";
import Table from "../components/Table";

export default function TrashStuff() {
    const [stuffsTrash, setStuffsTrash] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/stuffs/trash', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setStuffsTrash(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                Navigate('/login?message=' + encodeURIComponent('Anda belum login!'));
            }
        });
    }, []);

    const headers = [
        "#",
        "Name",
        "Category"
    ];

    const endpointModal = {
        "restore": "http://localhost:8000/stuffs/trash/restore/{id}",
        "delete_permanent": "http://localhost:8000/stuffs/trash/permanent-delete/{id}",
    };

    const inputData = {};

    const title = 'Stuff';

    const columnIdentitasDelete = "name";

    const buttons = [
        "restore",
        "permanentDelete",
    ];

    const tdColumn = {
        "name": null,
        "category": null,
    };

    return (
        <>
            <Case>
                <Table 
                    headers={headers} 
                    data={stuffsTrash} 
                    endpoint={endpointModal} 
                    inputData={inputData} 
                    titleModal={title} 
                    identitasColumn={columnIdentitasDelete} 
                    opsiButton={buttons} 
                    columnForTd={tdColumn}
                />
            </Case>
        </>
    );
}
