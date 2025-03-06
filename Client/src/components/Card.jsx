const Card=({children,index,you,id})=>{
    return (
        <div className="bg-white/20 backdrop-blur-2xl border border-white/30 flex gap-3 p-5 rounded">
            <h1>#{index+1}</h1>
            <h1 className="font-bold text-black">
            {children}
            {id===you?" (you) ":""}
            </h1>
        </div>
    )
}
export default Card