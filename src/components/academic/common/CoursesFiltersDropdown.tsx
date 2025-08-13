import React from "react";

type FilterDropdownProps = {
    isFilterDropdown: boolean;
    selectedStatuses: string[];
    selectedCourseTypes: string[];
    handleStatusCheckbox: (status: string) => void;
    handleCourseTypeCheckbox: (type: string) => void;
    handleApplyFilters: () => void;
    handleClearAllFilters: () => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>
};

export default function CoursesFiltersDropdown({
    isFilterDropdown,
    selectedStatuses,
    selectedCourseTypes,
    handleStatusCheckbox,
    handleCourseTypeCheckbox,
    handleApplyFilters,
    handleClearAllFilters,
    dropdownRef,
}: FilterDropdownProps) {


    return (
        <div
            ref={dropdownRef}
            className={`absolute bg-white rounded top-[11.5rem] w-[200px] p-2  z-50 gap-6 flex flex-col ${isFilterDropdown ? "animate-dropdown-in" : "animate-dropdown-out"
                }`}
            style={{ boxShadow: "0rem 0rem 0.2rem 0rem rgba(0,0,0,0.3)" }}
        >
            <div>
                <p className="font-semibold">Status</p>

                <ul className="flex flex-col justify-start gap-1">
                    <li className="flex items-center gap-1">
                        <input
                            id="active"
                            type="checkbox"
                            className="w-4 accent-primary"
                            checked={selectedStatuses.includes("active")}
                            onChange={() => handleStatusCheckbox("active")}
                        />
                        <label
                            htmlFor="active"
                            className="text-gray-800 font-medium cursor-pointer"
                        >
                            Active
                        </label>
                    </li>

                    <li className="flex items-center gap-1">
                        <input
                            id="inactive"
                            type="checkbox"
                            className="w-4 accent-primary"
                            checked={selectedStatuses.includes("inactive")}
                            onChange={() => handleStatusCheckbox("inactive")}
                        />
                        <label
                            htmlFor="inactive"
                            className="text-gray-800 font-medium cursor-pointer"
                        >
                            Inactive
                        </label>
                    </li>

                    <li className="flex items-center gap-1">
                        <input
                            id="draft"
                            type="checkbox"
                            className="w-4 accent-primary"
                            checked={selectedStatuses.includes("draft")}
                            onChange={() => handleStatusCheckbox("draft")}
                        />
                        <label
                            htmlFor="draft"
                            className="text-gray-800 font-medium cursor-pointer"
                        >
                            Draft
                        </label>
                    </li>
                </ul>
            </div>

            <div>
                <p className="font-semibold">Courses Type</p>

                <ul className="flex flex-col justify-start gap-1">
                    <li className="flex items-center gap-1">
                        <input
                            id="aptech"
                            type="checkbox"
                            className="w-4 accent-primary"
                            checked={selectedCourseTypes.includes("aptech")}
                            onChange={() => handleCourseTypeCheckbox("aptech")}
                        />
                        <label
                            htmlFor="aptech"
                            className="text-gray-800 font-medium cursor-pointer"
                        >
                            Aptech
                        </label>
                    </li>

                    <li className="flex items-center gap-1">
                        <input
                            id="cpms"
                            type="checkbox"
                            className="w-4 accent-primary"
                            checked={selectedCourseTypes.includes("cpms")}
                            onChange={() => handleCourseTypeCheckbox("cpms")}
                        />
                        <label
                            htmlFor="cpms"
                            className="text-gray-800 font-medium cursor-pointer"
                        >
                            CPMS
                        </label>
                    </li>

                    <li className="flex items-center gap-1">
                        <input
                            id="tecterminal"
                            type="checkbox"
                            className="w-4 accent-primary"
                            checked={selectedCourseTypes.includes("tecterminal")}
                            onChange={() => handleCourseTypeCheckbox("tecterminal")}
                        />
                        <label
                            htmlFor="tecterminal"
                            className="text-gray-800 font-medium cursor-pointer"
                        >
                            Tecterminal
                        </label>
                    </li>
                </ul>
            </div>

            <div className="flex items-end justify-around gap-1 text-[14px]">
                <button
                    className="bg-red-600 text-white text-center w-[100px] rounded p-1"
                    onClick={handleClearAllFilters}
                >
                    Clear All
                </button>
                <button
                    className="bg-primary text-white w-[100px] rounded p-1"
                    onClick={handleApplyFilters}
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
