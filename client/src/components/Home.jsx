import React from "react";

const Home = ({ setNavComponent }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-[90vh] bg-gray-100">
      {/* Left Side: Title, Description, and Button */}
      <div className="flex flex-col justify-center items-start text-left p-4 md:p-8 w-full md:w-1/2">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          ToDoList
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6">
          Join us today to experience the best services. Sign up now to get
          started and explore the amazing features we have to offer.
        </p>
        <button onClick={() => setNavComponent('signup')} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Sign Up Now
        </button>
      </div>

      <div className="hidden md:block md:w-1/2 h-[90vh]">
        <img
          src="https://img.freepik.com/free-vector/checklist-concept-illustration_114360-479.jpg"
          alt="Landing Page Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Home;
