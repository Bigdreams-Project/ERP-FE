"use client"

import { useState, useEffect } from "react";
import Pagination from "./Pagination";

interface CenterTableProps {
    searchQuery: string;
}

const CenterTable: React.FC<CenterTableProps> = ({ searchQuery }) => {
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
    // rows selector.
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    
    const itemsPerPage = 10;


    const filteredData = data.filter(center =>
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.email.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    // // Calculate total pages
    // const totalPages = Math.ceil(data.length / itemsPerPage);

    // // Slice the data to show only items for the current page
    // const paginatedData = data.slice(
    //     (currentPage - 1) * itemsPerPage,
    //     currentPage * itemsPerPage
    // );


    // handles individual checked rows
    const handleRowSelect = (id: string) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((rowId) => rowId !== id)
                : [...prevSelected, id]
        );
    };

    // handle all checked rows
    const handleSelectAll = () => {
        const currentPageIds = paginatedData.map(row => row.id); // only 10 per page

        const allSelected = currentPageIds.every(id => selectedRows.includes(id));

        if (allSelected) {
            // Uncheck all on this page
            setSelectedRows(prev =>
                prev.filter(id => !currentPageIds.includes(id))
            );
        } else {
            // Select all on this page
            setSelectedRows(prev =>
                Array.from(new Set([...prev, ...currentPageIds]))
            );
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);


    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="text-indigo-500 font-semibold">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="w-full ">
            <table className="min-w-full border-collapse text-[14px] p-3 " style={{ border: "1px sold black" }}>
                <thead>
                    <tr className="font-inter  font-medium text-[13px] text-left text-[rgba(0,0,0,0.6)]">
                        <th className="p-3">
                            <input
                                type="checkbox"
                                checked={
                                    paginatedData.length > 0 &&
                                    paginatedData.every(row => selectedRows.includes(row.id))
                                }
                                onChange={handleSelectAll}
                                className=" accent-indigo-500 text-white border-gray-300 rounded focus:ring-indigo-500"
                            />

                        </th>
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
                            <tr key={center.id} style={{ borderBottom: "1px solid #f3f4f6", borderTop: "1px solid #f3f4f6" }}>
                                <td className="p-3">
                                    <input type="checkbox"
                                        checked={selectedRows.includes(center.id)}
                                        onChange={() => handleRowSelect(center.id)}
                                        className=" accent-indigo-500 text-white border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                </td>
                                <td className="p-3" >{center.id}</td>
                                <td className="p-3">{center.code}</td>
                                <td className="p-3">{highlightMatch(center.name, searchQuery)}</td>
                                <td className="p-3">{highlightMatch(center.manager, searchQuery)}</td>
                                <td className="p-3">{highlightMatch(center.email, searchQuery)}</td>
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

export default CenterTable;