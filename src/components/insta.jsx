
import React, { useState } from "react";
import data from "../../product.json";

function Insta() {
  const [ splice, setSplice] = useState(
    data.categories.map(() => ({ likes: 0, dislikes: 0 }))
  );

  const handleLikeClick = (index) => {
    const updated = [... splice];
    const item = { ...updated[index] };
    item.likes += 1;
    updated.splice(index, 1, item);
    setSplice(updated);
  };

  const handleDislikeClick = (index) => {
    const updated = [... splice];
    const item = { ...updated[index] };
    item.dislikes += 1;
    updated.splice(index, 1, item);
    setSplice(updated);
  };
  return (
    <div className="h-full bg-gray-400">
      <div className="text-2xl pt-3 pb-5">
      <img src="/patel.jpg" alt="logo" className="w-20 h-16 mx-auto mb-2" />
        <h1 className="text-center font-bold">Patel Tours and Travels</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 px-4">
          {data.categories.map((item, index) => (
            <div
              key={index}
              className="rounded-lg shadow-2xl flex justify-center flex-col items-center border py-2 px-2 border-black bg-white"
            >
              <img
                src={`/${item.images[0]}`}
                alt={item.title}
                className="w-full h-48 object-cover rounded"
              />
              <a className="font-bold mt-2">{item.title}</a>
              <p className="text-sm text-center px-2">{item.description}</p>
              <div className="flex ml-10 space-x-5 mt-3 ">
                <button className="flex" onClick={() => handleLikeClick(index)}>
                
                  <img
                    className=" flex click hover-up  h-10 w-10  ml-3"
                    src="/jdjwrfdi.json"
                    alt=""
                  />
                 <p className="text-lg mt-2"> Like ({ splice[index].likes})</p>
                </button>
                <button className="flex" onClick={() => handleDislikeClick(index)}>
               
                  <img
                    className="  click hover-do  h-10 w-10  ml-3"
                    src="/jdjwrfdi1.json"
                    alt=""
                  />
                  <p className="text-lg mt-2"> Dislike ({ splice[index].dislikes})</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Insta;
