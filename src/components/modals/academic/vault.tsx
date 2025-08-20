import React from 'react'

const vault = () => {
  return (
    <div>
      {/* Fullname/Phone */}
      <div className="flex text-black mt-7 gap-4">
        <div className="flex flex-col w-1/2">
          <label htmlFor="fullname" className="font-normal text-sm">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            placeholder="Aisha Bukola Nneka"
            {...register("fullname")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
          />
          {errors.fullname && (
            <p className="text-red-600 text-sm">{errors.fullname.message}</p>
          )}
        </div>
        <div className="flex flex-col w-1/2">
          <label htmlFor="phone-number" className="font-normal text-sm">
            Phone Number
          </label>
          <input
            type="number"
            id="phone-number"
            placeholder="+234"
            {...register("phone")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none 
                "
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="text-black mt-5 flex flex-col w-full">
        <label htmlFor="email" className="font-normal text-sm">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="jane@example.com"
          {...register("email")}
          className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Home address */}
      <div className="text-black mt-5 flex flex-col w-full">
        <label htmlFor="home-address" className="font-normal text-sm">
          Home Address
        </label>
        <input
          type="text"
          id="home-address"
          placeholder="1020 West Street, Las Vegas, NV 89104"
          {...register("address")}
          className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
        />{" "}
        {errors.address && (
          <p className="text-red-600 text-sm">{errors.address.message}</p>
        )}
      </div>

      {/* Parent name/Parent phone number */}
      <div className="flex text-black mt-5 gap-4">
        <div className="flex flex-col w-1/2">
          <label htmlFor="parent-name" className="font-normal text-sm">
            Parent/Guardian Name
          </label>
          <input
            type="text"
            id="parent-name"
            placeholder="John Doe Emeka"
            {...register("parentName")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label htmlFor="parent-phone-number" className="font-normal text-sm">
            Parent/Guardian Phone Number
          </label>
          <input
            type="number"
            id="parent-phone-number"
            placeholder="+234"
            {...register("parentPhone")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none
              "
          />{" "}
          {errors.parentPhone && (
            <p className="text-red-600 text-sm">{errors.parentPhone.message}</p>
          )}
        </div>
      </div>

      {/* Parent email */}
      <div className="text-black mt-5 flex flex-col w-full">
        <label htmlFor="email" className="font-normal text-sm">
          Parent/Guardian Email {"(Optional)"}
        </label>
        <input
          type="email"
          id="email"
          placeholder="john@example.com"
          {...register("parentEmail")}
          className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
        />{" "}
        {errors.parentEmail && (
          <p className="text-red-600 text-sm">{errors.parentEmail.message}</p>
        )}
      </div>

      {/* Course of interest/Enquiry date */}
      <div className="flex text-black mt-5 gap-4">
        <div className="text-black flex flex-col w-1/2 relative">
          <label htmlFor="email" className="font-normal text-sm">
            Course of Interest
          </label>
          <select
            id="course"
            {...register("course")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
          >
            <option value="">Select Course</option>
            {coursesData.map((course) => (
              <option key={course.name} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
            ⮟
          </span>
          {errors.course && (
            <p className="text-red-600 text-sm">{errors.course.message}</p>
          )}
        </div>
        <div className="flex flex-col w-1/2">
          <label htmlFor="enquiry-date" className="font-normal text-sm">
            Enquiry Date
          </label>
          <input
            type="date"
            id="enquiryDate"
            {...register("enquiryDate")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none
              "
          />
          {errors.enquiryDate && (
            <p className="text-red-600 text-sm">{errors.enquiryDate.message}</p>
          )}
        </div>
      </div>

      {/* Source/Status */}
      <div className="flex text-black mt-5 gap-4">
        <div className="flex flex-col w-1/2 relative">
          <label htmlFor="source" className="font-normal text-sm">
            Source
          </label>
          <select
            id="source"
            {...register("source")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
          >
            <option value="">Select Source</option>
            <option value="Online Ad">Online Ad</option>
            <option value="Referral">Referral</option>
            <option value="Walk-in">Walk-in</option>
          </select>
          <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
            ⮟
          </span>
          {errors.source && (
            <p className="text-red-600 text-sm">{errors.source.message}</p>
          )}
        </div>
        <div className="flex flex-col w-1/2 relative">
          <label htmlFor="status" className="font-normal text-sm">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
          >
            <option value="">Choose Status</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
          <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
            ⮟
          </span>
          {errors.status && (
            <p className="text-red-600 text-sm">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Next Follow-up/Study Type */}
      <div className="flex text-black mt-5 gap-4">
        <div className="flex flex-col w-1/2 relative">
          <label htmlFor="nextFollowup" className="font-normal text-sm">
            Next Follow-up
          </label>
          <input
            type="date"
            id="nextFollowup"
            {...register("nextFollowup")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none
              "
          />
          {errors.nextFollowup && (
            <p className="text-red-600 text-sm">
              {errors.nextFollowup.message}
            </p>
          )}
        </div>
        <div className="flex flex-col w-1/2 relative">
          <label htmlFor="studyType" className="font-normal text-sm">
            Study Type
          </label>
          <select
            id="studyType"
            {...register("studyType")}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
          >
            <option value="">Choose Type</option>
            <option value="Online">Online</option>
            <option value="On-site">On-site</option>
          </select>
          <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
            ⮟
          </span>
          {errors.studyType && (
            <p className="text-red-600 text-sm">{errors.studyType.message}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-1 duration-500 ease-in-out"
        >
          Close
        </button>
        <button
          type="submit"
          className={`mt-4 px-4 py-2 text-white rounded duration-500 ease-in-out ${
            isValid
              ? "bg-[hsl(237,74%,60%)] hover:bg-[hsl(237,74%,45%)]"
              : "bg-[#636ae8] opacity-70 cursor-not-allowed"
          }`}
          disabled={!isValid}
        >
          Complete
        </button>
      </div>
    </div>
  );
}

export default vault