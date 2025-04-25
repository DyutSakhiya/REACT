// import React, { useState } from "react";

// function LikeDislike() {
//   // const [name, setName] = useState("");
//   // const [number, setNumber] = useState("");
//   // const [dob, setDob] = useState("");
//   const [showValues, setShowValues] = useState(false);
//   const [userDate, setUserDate] = useState({
//     name: "",
//     number: "",
//     dob: "",
//   });
//   function hendleOnChange(name, value) {
//     // const { name, value } = e.target;
//     // ;
//     // e.target.value;
//     setUserDate((obj) => ({
//       ...obj,
//       [name]: value,
//       // name : "eet"
//     }));
//   }
//   const handleSubmit = () => {
//     setShowValues(true);
//     console.log('userDate:', setUserDate);
//   }

//   // const handleNameChange = (obj) => {
//   //   setName(obj.target.value);
//   // };

//   // const handleNumberChange = (obj) => {
//   //   setNumber(obj.target.value);
//   // };

//   // const handleDobChange = (obj) => {
//   //   setDob(obj.target.value);
//   // };

//   // const handleSubmit = () => {
//   //   setShowValues(true);
//   // };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-md rounded-lg s p-6 space-y-4">
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Name:
//           </label>
//           <input
//           type="text"
//             name="name"
//             value={userDate.name}
//             onChange={(e) => hendleOnChange(e.target.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Number:
//           </label>
//           <input
//             type="number"
//             name="number"
//             value={userDate.number}
//             onChange={(e) => hendleOnChange(e.target.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Date of Birth:
//           </label>
//           <input
//             type="date"
//             name="dob"
//             value={userDate.dob}
//             onChange={(e) => hendleOnChange(e.target.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
//           />
//         </div>

//         <div className="pt-2">
//           <button
//             className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//         </div>

//         {showValues && (
//           <div className="mt-6 p-4  ">
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">
//               Submitted Values:
//             </h2>
//             <p className="text-gray-700">
//               <span className="font-medium">Name:</span> {userDate.name}
//             </p>
//             <p className="text-gray-700">
//               <span className="font-medium">Number:</span> {userDate.number}
//             </p>
//             <p className="text-gray-700">
//               <span className="font-medium">Date of Birth:</span> {userDate.dob}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LikeDislike;

import React, { useState } from "react";

function LikeDislike() {
  const [boxes, setBoxes] = useState([]);

  const addBox = () => {
    setBoxes([...boxes, {}]);
  };

  return (
    <div>
      <div className="flex flex-wrap" style={{}}>
        {boxes.map((box, index) => (
          <div
            key={index}
            style={{
              width: "100px", 
              height: "100px",
              backgroundColor: "lightblue",
              margin: "10px",
            }}
          ></div>
        ))}
      </div>
      <button
        className=" h-14 w-16 ml-4 bg-blue-700 rounded-md"
        onClick={addBox}
      >
        Add Box
      </button>
    </div>
  );
}

export default LikeDislike;
