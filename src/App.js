import React, { useState, useRef } from "react";
import captureVideoFrame from "capture-video-frame";
import axios from 'axios'
import './App.css';

function App() {
  const [count, setCount] = useState(0)
  const [category, setCategory] = useState("--")
  const [warning, setWarning] = useState("None")
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState("Normal")
  const [frame, setFrame] = useState(null)
  const [color, setColor] = useState("green-500")
  const [image, setImage] = useState(null)
  const [type, setType] = useState("Image")

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


  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleImageChange = async (event) => {
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
    if (result2 === "Heavily_Crowded")
      setWarning("Warning! Be alert!")
  }

  const handleVideoChange = async (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setImage(URL.createObjectURL(fileUploaded));
  }

  const videoProcess = async () => {
    setLoading(true)
    const frame2 = captureVideoFrame("uploaded-video", "jpeg")
    console.log("Frame Captured!")
    console.log(frame2)
    setFrame(frame2.dataUri)

    const response = await fetch(frame2.dataUri)
    const blob = await response.blob()
    const file = new File([blob], 'dot.jpg', { type: 'image/jpeg' })

    const formData = new FormData();
    formData.append('file', file)
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
    if (result2 === "Heavily_Crowded")
      setWarning("Warning! Be alert!")
  }


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
    else {
      setColor("green-500")
      setText("Normal")
    }
  }


  function renderFrame() {
    if (type === "Video") {
      if (frame) {
        return (
          <div className="mb-2">
            <h1 className="text-xl font-bold">Captured Frame</h1>
            <img src={frame} alt="captured frame"></img>
          </div>
        )
      }
      else {
        return (
          <div className="mb-2">
            <h1 className="text-xl font-bold">Captured frame</h1>
            <img src="noImage.png" alt="no captured frame"/>
          </div>

        )
      }
    }
  }

  function renderDisplay() {
    console.log(type)
    if (type === "Image") {
      if (image) {
        return (
          <div className={`h-500 m-2 bg-gray-200 rounded-lg flex flex-col justify-center items-center`}>
            <img id="uploaded-video" src={image} className="w-full h-full rounded-lg" alt="Uploaded file" />
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
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        )
      }
    }
    else {
      if (image) {
        return (
          <div className={`h-500 m-2 bg-gray-200 rounded-lg flex flex-col justify-center items-center`}>
            <video id="uploaded-video" src={image} className="w-full h-full rounded-lg" alt="Uploaded file" autoPlay muted />
          </div>
        )
      }
      else {
        return (
          <div className={`h-500 m-2 bg-gray-200 rounded-lg flex flex-col justify-center items-center`}>
            <p className="text-gray-600">Input a video of crowd.</p>
            <button className="bg-green-500 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition" onClick={handleClick}>Upload a video</button>
            <input
              type="file"
              name="file"
              ref={hiddenFileInput}
              onChange={handleVideoChange}
              style={{ display: 'none' }}
            />
          </div>
        )
      }
    }
  }

  function renderResult(i){
    if(loading){
      return(
        <div>
        <div style={{borderTopColor:"transparent"}} class="w-8 h-8 border-4 border-black border-solid rounded-full animate-spin"></div>
      </div>
      )
    }
    else return (data[i].value)
  }



  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1 className="text-4xl font-bold text-green-700">Crowd Management Software</h1>

          <select className="px-3 py-2 border-2 rounded-xl font-bold text-xl border-red-600" onChange={(e) => {
            setType(e.target.value)
            setImage(null)
            setCategory("--")
            setCount(0)
            setWarning("None")
            setColor("green-500")
            setText("Normal")
          }}>
            <option>Image</option>
            <option>Video</option>
          </select>

        </div>
        <div className='app__stats py-5'>
          <div className="grid grid-cols-3 gap-5">
            <div className={`card flex-1 bg-white border-t-8 border-green-600 mr-3 p-4 rounded-md pb-6 shadow-info hover:shadow-xl transition-all`}>
              <div className='cardContent'>
                <div className='title font-medium text-2xl'>
                  No. of People
                </div>
                <div className={`font-bold text-green-600 text-3xl mb-2 py-3`}>
                  {renderResult(0)}
                </div>
                <div>
                  {data[0].description}
                </div>
              </div>
            </div>

            <div className={`card flex-1 bg-white border-t-8 border-amber-900 mr-3 p-4 rounded-md pb-6 shadow-info hover:shadow-xl transition-all`}>
              <div className='cardContent'>
                <div className='title font-medium text-2xl'>
                  Crowd Classification
                </div>
                <div className={`font-bold text-amber-900 text-3xl mb-2 py-3`}>
                  {renderResult(1)}
                </div>
                <div>
                  {data[1].description}
                </div>
              </div>
            </div>

            <div className={`card flex-1 bg-white border-t-8 border-red-600 mr-3 p-4 rounded-md pb-6 shadow-info hover:shadow-xl transition-all`}>
              <div className='cardContent'>
                <div className='title font-medium text-2xl'>
                  Warning Status
                </div>
                <div className={`font-bold text-red-600 text-3xl mb-2 py-3`}>
                  {data[2].value}
                </div>
                <div>
                  {data[2].description}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white h-600 rounded-lg p-2 shadow-lg flex flex-col ">
            {renderDisplay()}
            <div className="flex justify-end mr-2 ">
              <div className="flex">
                <div className={`${type==="Video" ?"bg-green-500 mr-3  hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition" : "hidden"} `} onClick={videoProcess}>
                  Process
                </div>
                <div className="bg-red-600 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer transition" onClick={() => {
                  setImage(null)
                  setCategory("--")
                  setCount(0)
                  setWarning("None")
                  setColor("green-500")
                  setText("Normal")
                  setFrame(null)
                }}>
                  Reset
                </div>
              </div>
            </div>

          </div>
          <div className="p-2 bg-gray-600 rounded-lg flex flex-col">
            <div className="bg-white h-full flex flex-col p-2 rounded-lg shadow-info">
              {renderFrame()}
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
