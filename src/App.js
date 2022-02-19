import React, { useState, useRef } from "react";
import InfoBox from './components/InfoBox/InfoBox';
import './App.css';

function App() {

  const data =[
    {
      heading:"No of people",
      value:"8000",
      description:"Number of people currently present",
      color:"green-600"
    },
    {
      heading:"Crowd classification",
      value:"Normal Crowd",
      description:"Classification of crowd based on input image",
      color:"amber-900"
    },
    {
      heading:"Warning Status",
      value:"None",
      description:"Warning will be triggered in case of overcrowding",
      color:"red-600"
    },
  ]

  const color = "green-500";
  const [image, setImage] = useState(null)

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setImage(URL.createObjectURL(fileUploaded));
    console.log(image)
  }

  function renderImage() {
    if (image) {
      return (
        <div className={`h-500 m-2 bg-gray-200 rounded-lg flex flex-col justify-center items-center`}>
          <img src={image} className="w-full h-full rounded-lg" alt="Uploaded file" />
        </div>
      )
    }
    else {
      return (
        <div className={`h-500 m-2 bg-gray-200 rounded-lg flex flex-col justify-center items-center`}>
          <p className="text-gray-600">Input an image of the crowd to get predictions</p>
          <button className="bg-green-500 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition" onClick={handleClick}>Upload an image</button>
          <input
            type="file"
            name="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
      )
    }
  }



  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1 className="text-4xl font-bold text-green-700">Crowd Management Software</h1>
        </div>
        <div className='app__stats py-5'>
          <div className="grid grid-cols-3 gap-5">
            {data.map((val,ind)=>(
              <InfoBox title={val.heading} value={val.value} desc={val.description} color={val.color} key={ind}/>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white h-600 rounded-lg p-2 shadow-lg flex flex-col ">
            {/* <div className={`h-500 m-2 bg-gray-200 rounded-lg flex flex-col justify-center items-center`}>
              <p className="text-gray-600">Input an image of the crowd to get predictions</p>
              <button className="bg-green-500 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition" onClick={handleClick}>Upload an image</button>
              <input
                type="file"
                name="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </div> */}
            {renderImage()}
            <div className="flex justify-between mr-2 ">
              <div>
                <button className="bg-green-500 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition ml-2" onClick={handleClick}>Upload image</button>
                <input
                  type="file"
                  name="file"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="flex">
                <div className="bg-green-500 mr-3  hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition">
                  Process
                </div>
                <div className="bg-red-600 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition" onClick={() => setImage(null)}>
                  Reset
                </div>
              </div>
            </div>

          </div>
          <div className="p-2 bg-gray-600 rounded-lg flex flex-col">
            <div className="bg-white h-full flex flex-col p-2 rounded-lg shadow-info">
              <h2 className="text-xl font-bold">Traffic Light color</h2>
              <div className="flex justify-center">
                <div className={`h-20 w-20 bg-${color} m-10 relative rounded-full  flex justify-center items-center text-white font-semibold`}>
                  <div className={`h-full w-full absolute rounded-full animate-ping bg-${color}`}>
                  </div>
                  <div className="z-10"> Normal</div>
                </div>
                
              </div>
              <div>
                <h1 className="font-bold mb-2">Reference</h1>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full mr-2 bg-red-600"></div>
                  <p>Heavily Crowded</p>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full mr-2 bg-amber-900"></div>
                  <p> Crowded</p>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full mr-2 bg-yellow-400"></div>
                  <p> Semi-Crowded</p>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full mr-2 bg-blue-700"></div>
                  <p> Light Crowd</p>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full mr-2 bg-green-500"></div>
                  <p> Normal</p>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
