const Msg = ({ username, msg,guess}) => {
    return (
        <>
    {
        !guess?
    <div className="w-full flex flex-col items-start gap-0 p-2">
            <h1 className="font-bold text-pink-500">{username}:</h1>
            <h2 className="w-full break-words bg-gray-100 p-2 rounded-md text-sm">
                {msg}
            </h2>
        </div>:<div className="w-full flex  items-start gap-0 p-0">

            <h2 className="w-full break-words bg-green-500 p-2  font-semibold rounded-md text-sm">
                <span className="font-bold text-white text-lg">{username}</span> guessed correctly
            </h2>
        </div>
        
    }
     </>
    );
};
export default Msg;
