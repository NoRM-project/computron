import Console from "./Console"
import FileTabs from "./FileTabs"
import Healper from "./Helper"
import Memory from "./Memory"
import Menu from "./Menu"
import './app.css'

function App() {
  return (
    <>
      <Menu/>
      <div className="application-body">
        <Healper/>
        <FileTabs/>
        <Console/>
        <Memory/>
      </div>
    </>
  )
}

export default App
