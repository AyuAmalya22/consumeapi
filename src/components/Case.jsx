import React from "react";
import Navbar from "./Navbar";

export default function Case({ children }) {
    return (
        <div className="bg-gray-900 dark:bg-gray-900 min-h-screen">
        <Navbar />
        <section>{children}</section>
        </div>
    );
}

//{children} merupakan sebuah props. Apa itu props? Props (singkatan dari properties) adalah cara untuk mengirim data dari komponen induk (parent component) ke komponen anak (child component) di React. Biasanya, props digunakan untuk membuat elemen/data dinamis yang akan berubah-ubah di tiap halamannya.