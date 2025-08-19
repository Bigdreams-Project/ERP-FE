const StudentsFilter = () => {
    return (
        <div className="font-inter flex flex-col justify-between items-start mt-3 absolute w-[180px] h-[200px] bg-[#FFFFFFFF] shadow-lg rounded z-50 p-3 ">
            <div>
                <h1>Status</h1>
                <div>
                    <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="active" className="accent-primary" />
                        <label htmlFor="active">Active</label>
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="dropout" className="accent-primary" />
                        <label htmlFor="dropout">Drop-Out</label>
                    </div >
                    <div className="flex items-center gap-1">
                        <input type="checkbox" name="" id="graduated" className="accent-primary" />
                        <label htmlFor="graduated">Graduated</label>
                    </div>
                </div>

            </div>
            <div className="w-full flex justify-between  gap-1">
                <button className="w-[86px] h-[28px] text-[#FFFFFFFF] bg-[#DE3B40FF]  hover:bg-[#C12126FF] hover:text-[#FFFFFFFF] rounded transition-all duration-300 active:text-[#FFFFFFFF] active:bg-[#AA1D22FF]">Clear All</button>
                <button className="w-[86px] h-[28px] text-[#FFFFFFFF] bg-[#636AE8FF] hover:text-[#FFFFFFFF] hover:bg-[#4850E4FF] active:text-[#FFFFFFFF] active:bg-[#2C35E0FF] rounded transition-all duration-300">Apply</button>
            </div>
        </div>
    )
}
export default StudentsFilter;