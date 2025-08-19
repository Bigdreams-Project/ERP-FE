import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CiCalendar } from "react-icons/ci";
import { Dispatch, SetStateAction } from "react";

type LeadsFilterProps = {
    inquiryDate: { startDate: Date; endDate: Date };
    followupDate: { startDate: Date; endDate: Date };
    onInquiryDateChange?: (range: { startDate: Date; endDate: Date }) => void;
    onFollowupDateChange?: (range: { startDate: Date; endDate: Date }) => void;
    onSubmit: () => void;
    getAlldateType: string;
    setAlldateType: Dispatch<SetStateAction<string>>;
    onClear: () => void;
};

const LeadsFilter: React.FC<LeadsFilterProps> = ({
    inquiryDate,
    followupDate,
    onInquiryDateChange,
    onFollowupDateChange,
    onSubmit,
    getAlldateType,
    setAlldateType,
    onClear
}) => {

    const [openDatetype, setOpenDatetype] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const allDatetype = ["Inquiry", "Next Follow-up"];

    const [inquiryRange, setInquiryRange] = useState<Range[]>([
        { startDate: inquiryDate.startDate, endDate: inquiryDate.endDate, key: "selection" },
    ]);

    const [followupRange, setFollowupRange] = useState<Range[]>([
        { startDate: followupDate.startDate, endDate: followupDate.endDate, key: "selection" },
    ]);


    const handleSelect = (ranges: any) => {
        if (getAlldateType === "Inquiry") {
            setInquiryRange([ranges.selection]);
            onInquiryDateChange?.({
                startDate: ranges.selection.startDate,
                endDate: ranges.selection.endDate,
            });
        } else {
            setFollowupRange([ranges.selection]);
            onFollowupDateChange?.({
                startDate: ranges.selection.startDate,
                endDate: ranges.selection.endDate,
            });
        }
    };

    return (
        <div className="font-inter flex flex-col justify-between items-start mt-3 absolute w-[180px] h-[200px] bg-[#FFFFFFFF] shadow-lg rounded z-50 p-3 ">
            <div>
                <div style={{ border: "2px solid transparent" }}>
                    <div className="flex items-center p-1" onClick={() => setOpenDatetype(!openDatetype)}>
                        <p className="cursor-pointer text-[#171A1FFF] text-[14px] font-bold">{getAlldateType}</p>
                        <FiChevronDown className="ml-1" />
                    </div>
                    {openDatetype && (
                        <div className={`w-auto absolute z-50 flex flex-col gap-1 text-start !items-start bg-[#FFFFFFFF] shadow rounded p-1 ${openDatetype ? "animate-dropdown-in" : "animate-dropdown-out"}`}>
                            {allDatetype.map((datetype, i) => (
                                <p
                                    key={i}
                                    onClick={() => {
                                        if (datetype !== getAlldateType) {
                                            setAlldateType(datetype);
                                        }
                                        setOpenDatetype(false);
                                    }}
                                    className="w-full cursor-pointer hover:bg-indigo-50 p-1"
                                >
                                    {datetype}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    <div onClick={() => setOpenDatePicker(!openDatePicker)} className="flex items-center gap-1 cursor-pointer w-[120px] p-2 rounded font-normal" style={{ border: "2px solid  #BCC1CAFF" }}>
                        <CiCalendar />
                        <p className="text-[#171A1FFF] mt-[0.1rem] text-[12px] text-center" >
                            {getAlldateType === "Inquiry"
                                ? `${inquiryRange[0]?.startDate?.toLocaleDateString()}`
                                : `${followupRange[0]?.startDate?.toLocaleDateString()}`}
                        </p>
                    </div>
                    {openDatePicker && (
                        <div className={`absolute right-[11.7rem] top-12 shadow ${openDatePicker ? "animate-dropdown-in" : "animate-dropdown-out"}`}>
                            <DateRange
                                ranges={getAlldateType === "Inquiry" ? inquiryRange : followupRange}
                                onChange={handleSelect}
                                moveRangeOnFirstSelection={false}
                                editableDateInputs={true}
                            />
                        </div>
                    )}
                </div>

            </div>
            <div className="w-full flex  justify-between">
                <button className="bg-[#DE3B40FF] text-[#FFFFFFFF] hover:text-[#FFFFFFFF] hover:bg-[#C12126FF] transition-all  duration-300 text-[14px] w-[74px] h-[36px] rounded" onClick={onClear}>Clean</button>
                <button className="bg-[#636AE8FF] text-[#FFFFFFFF] hover:text-[#FFFFFFFF]  hover:bg-[#4850E4FF] transition-all duration-300 text-[14px] w-[74px] h-[36px] rounded" onClick={onSubmit}>Apply</button>
            </div>
        </div>
    );
};

export default LeadsFilter;
