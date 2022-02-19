import React from 'react'

function InfoBox(props) {

  /**
   * PurgeCSS:
   * border-red-600
   * border-green-600
   * border-amber-900
   * text-green-600
   * text-amber-900
   * text-red-600
   */

  return (
    <div className={`card flex-1 bg-white border-t-8 border-${props.color} mr-3 p-4 rounded-md pb-6 shadow-info hover:shadow-xl transition-all`}>
      <div className='cardContent'>
        <div className='title font-medium text-2xl'>
          {props.title}
        </div>
        <div className={`font-bold text-${props.color} text-3xl mb-2 py-3`}>
          {props.value}         
        </div>
        <div>
          {props.desc}
        </div>
      </div>
    </div>
  )
}

export default InfoBox