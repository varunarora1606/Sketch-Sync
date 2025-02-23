function ToolKit({setShape}: {setShape: any}) {
  return (
    <div className="flex gap-2">
        <button className="text-white" onClick={() => {
          setShape("circle")
        }}>circle</button>
        <button className="text-white" onClick={() => {
          setShape("rect")
        }}>rect</button>
        <button className="text-white" onClick={() => {
          setShape("ellipse")
        }}>ellipse</button>
        <button className="text-white" onClick={() => {
          setShape("square")
        }}>square</button>
        <button className="text-white" onClick={() => {
          setShape("pencil")
        }}>pencil</button>
        <button className="text-white" onClick={() => {
          setShape("selection")
        }}>selection</button>
    </div>
  )
}

export default ToolKit