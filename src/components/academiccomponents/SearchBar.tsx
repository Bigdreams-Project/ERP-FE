
import { BiSearchAlt } from "react-icons/bi";

const SearchBar = () => {
    return (
        <div className="min-w-full flex items-center text-center gap-2  bg-[rgb(238,242,255)] py-[0.4rem] px-[0.8rem] rounded-full focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-200">

            <BiSearchAlt className="text-[rgb(129,140,248)] " size={19} />

            <input type="text" placeholder="Search for students, courses, batches, invoices..." className="w-full outline-0 border-0 placeholder:text-[rgb(129,140,248)]  flex items-center text-indigo-500 bg-transparent" name="input" />

        </div>
    )
}
export default SearchBar;