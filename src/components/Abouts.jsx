import React, { useState } from 'react'

export default function Abouts() {

    const [myStyle, ssetmyStyle] = useState({

        
            color: 'white',
            backgroundColor:'black'
        

    })

    const [btntext, setbtntext] = useState("Enable Dark Mode")

    const toggleStyle = ()=>{
        if(myStyle.color == 'white'){
            setmyStyle({

                color: 'black',
                backgroundColor: 'white'
            })
            setbtntext("Enable Light Mode")
        }

        else{
            setmyStyle({
                color: 'White',
                backgroundColor: 'black'
            })
            setbtntext("Enable Light Mode")

        }
    }

    

    
  return (

    <>
    <div className='container' style={myStyle}>
        <div class="space-y-4" id="accordionExample">
  <div class="border border-gray-300 rounded">
    <h2 class="mb-0">
      <button
        class="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium focus:outline-none focus:ring"
        type="button"
        onclick="toggleAccordion('collapseOne')"
      >
        Accordion Item #1
      </button>
    </h2>
    <div
      id="collapseOne"
      class="overflow-hidden transition-max-height duration-300 max-h-screen"
    >
      <div class="p-4">
        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>

  <div class="border border-gray-300 rounded">
    <h2 class="mb-0">
      <button
        class="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium focus:outline-none focus:ring"
        type="button"
        onclick="toggleAccordion('collapseTwo')"
      >
        Accordion Item #2
      </button>
    </h2>
    <div
      id="collapseTwo"
      class="overflow-hidden transition-max-height duration-300 max-h-0"
    >
      <div class="p-4">
        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>

  <div class="border border-gray-300 rounded">
    <h2 class="mb-0">
      <button
        class="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium focus:outline-none focus:ring"
        type="button"
        onclick="toggleAccordion('collapseThree')"
      >
        Accordion Item #3
      </button>
    </h2>
    <div
      id="collapseThree"
      class="overflow-hidden transition-max-height duration-300 max-h-0"
    >
      <div class="p-4">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
</div>
    <div className="container">
        <button onclick={toggleStyle} type="button" className="btn btn-primary text-white bg-blue-700 hover:bg-blue-950 rounded-full h-10 w-[190px] mx-2 mt-5">{btntext}</button>
    </div>



    </div>
    </>
  )
}
