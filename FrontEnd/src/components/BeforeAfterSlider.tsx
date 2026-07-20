import { useState } from 'react'
import { renovationImages } from '../data'
import { Icon } from './Icon'

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(56)

  return (
    <div className='renovation-visual'>
      <div className='before-after-slider'>
        <img className='before-image' src={renovationImages.before} alt='Living înainte de renovare' />
        <div className='after-image-wrap' style={{ width: `${position}%` }}><img src={renovationImages.after} alt='Living după renovare' /></div>
        <span className='before-label'>Înainte</span><span className='after-label'>După</span>
        <div className='slider-handle' style={{ left: `${position}%` }}><span><Icon name='compare' size={18} /></span></div>
        <input aria-label='Compară fotografiile înainte și după' type='range' min='8' max='92' value={position} onChange={(event) => setPosition(Number(event.target.value))} />
      </div>
      <div className='renovation-evidence'>
        <div><span>Perioada lucrării</span><strong>12 aug. – 30 sept. 2024</strong></div>
        <div><span>Cost raportat</span><strong>€18.400</strong></div>
        <div><span>Efect estimat asupra prețului</span><strong className='semantic-positive'>+11%</strong></div>
        <div><span>Documente</span><strong><Icon name='file' size={16} /> 7 facturi verificate</strong></div>
      </div>
    </div>
  )
}
