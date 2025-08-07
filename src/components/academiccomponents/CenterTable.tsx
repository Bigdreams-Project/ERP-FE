"use client"

import { useState } from "react";
import Pagination from "./Pagination";

export default function CenterTable() {
    const centers = [
        {
            id: '1',
            code: 'CTR001',
            name: 'Lagos Central',
            manager: 'Jane Doe',
            email: 'lagos@center.com',
            phone: '08012345678',
            address: '23 Marina St, Lagos',
            students: 120,
            leads: 35,
        },
        {
            id: '2',
            code: 'CTR002',
            name: 'Abuja North',
            manager: 'John Smith',
            email: 'abuja@center.com',
            phone: '08123456789',
            address: '10 Maitama Rd, Abuja',
            students: 75,
            leads: 22,
        },
        {
            id: '3',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '4',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '5',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '6',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '7',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '8',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '9',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '10',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '11',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        {
            id: '12',
            code: 'CTR003',
            name: 'Enugu Center',
            manager: 'Ifoma ugwu',
            email: 'enugucenter@gamil.com',
            phone: '07023456789',
            address: '10 Uwani Rd, Enugu',
            students: 30,
            leads: 10,
        },
        // Add more mock items...
    ];
    const [data] = useState(centers); // Later we can fetch this from API

    // adding paginaton
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Slice the data to show only items for the current page
    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    console.log(paginatedData)

    return (
        <div className="w-full ">
            <table className="min-w-full border-collapse text-[14px]">
                <thead>
                    <tr className="font-inter  font-medium text-[13px] text-left text-[rgba(0,0,0,0.6)]">
                        <th className="p-3">#</th>
                        <th className="p-3">Center Code</th>
                        <th className="p-3">Center Name</th>
                        <th className="p-3">Center  Manager</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Center Address</th>
                        <th className="p-3">Enrolled Students</th>
                        <th className="p-3">Leads</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        paginatedData.map((center) => (
                            <tr key={center.id}>
                                <td className="p-3">{center.id}</td>
                                <td className="p-3">{center.code}</td>
                                <td className="p-3">{center.name}</td>
                                <td className="p-3">{center.manager}</td>
                                <td className="p-3">{center.email}</td>
                                <td className="p-3">{center.phone}</td>
                                <td className="p-">{center.address}</td>
                                <td className="p-3">{center.students}</td>
                                <td className="p-3">{center.leads}</td>
                                <td className="p-3"><button>actions</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}