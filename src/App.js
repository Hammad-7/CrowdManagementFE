import React, { useState, useRef } from "react";
import InfoBox from './components/InfoBox/InfoBox';
import axios from 'axios'
import './App.css';

function App() {
  const [count, setCount] = useState(0)
  const [category, setCategory] = useState("--")
  const [warning, setWarning] = useState("None")
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState("Normal")

  const [video,setVideo] = useState(null)

  const data = [
    {
      heading: "No of people",
      value: count,
      description: "Number of people currently present",
      color: "green-600"
    },
    {
      heading: "Crowd classification",
      value: category,
      description: "Classification of crowd based on input image",
      color: "amber-900"
    },
    {
      heading: "Warning Status",
      value: warning,
      description: "Warning will be triggered in case of overcrowding",
      color: "red-600"
    },
  ]

  const [color, setColor] = useState("green-500")
  const [image, setImage] = useState(null)


  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event) => {
    setLoading(true)
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setImage(URL.createObjectURL(fileUploaded));

    const formData = new FormData();
    formData.append('file', fileUploaded)
    let url = "http://127.0.0.1:8000/predictCount/"
    let res = await axios.post(url, formData);
    let result2 = res.data;
    console.log(result2)
    setCount(result2);
    url = 'http://127.0.0.1:8000/predictClass/';
    res = await axios.post(url, formData);
    result2 = res.data;
    setCategory(result2)
    setLoading(false)
    console.log("Done!!")
    setTraffic(result2)
    if(result2==="Heavily_Crowded")
    setWarning("Warning! Be alert!")
  }

  // function renderResults(){
  //   if (loading){

  //   }
  // }

  function setTraffic(result) {
    console.log("Here I am!!")
    console.log(result)
    if (result === "Heavily_Crowded") {
      setColor("red-600")
      setText("Stop!")
    }
    else if (result === "Crowded") {
      setColor("amber-900")
      setText("Careful!")
    }
    else if (result === "Semi_Crowded") {
      setColor("yellow-400")
      setText("Slower!")
    }
    else if (result === "Light_Crowded") {
      setColor("blue-700")
      setText("Slow!")
    }
    else{
      setColor("green-500")
      setText("Normal")
    }
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

  // function renderCount(){
  //   if(count)

  // }




  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1 className="text-4xl font-bold text-green-700">Crowd Management Software</h1>
        </div>
        <div className='app__stats py-5'>
          <div className="grid grid-cols-3 gap-5">
            {data.map((val, ind) => (
              <InfoBox title={val.heading} value={val.value} desc={val.description} color={val.color} key={ind} />
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
                <div className="bg-red-600 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition" onClick={() => {
                  setImage(null)
                  setCategory("--")
                  setCount(0)
                  setWarning("None")
                  setColor("green-500")
                  setText("Normal")
                }}>
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
                  <div className="z-10"> {text}</div>
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
