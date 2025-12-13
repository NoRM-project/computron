import './memory.css'
import Ram from './Ram'
import Registers from './Registers'

export default function Memory() {
  return (
    <div className="memory-container container">
        <div className="memory-header headers-font">CPU&Memory</div>
        <Registers/>
        <Ram/>          
    </div>
  )
}
