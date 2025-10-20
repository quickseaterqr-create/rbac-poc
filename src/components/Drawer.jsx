import React from 'react'

export default function Drawer({onClose, children, width='520px', title}){
  return (
    <div className='modal-overlay' onClick={onClose} style={{justifyContent:'flex-end'}}>
      <div className='drawer' style={{width}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h3 style={{margin:0}}>{title}</h3>
          <button className='btn' onClick={onClose}>X</button>
        </div>
        <div className='drawer-body'>
          {children}
        </div>
      </div>
    </div>
  )
}
