const Msg = ({ username, msg}) => {
    return (
        <div className="w-full flex flex-col items-start gap-0 p-2">
            <h1 className="font-bold text-pink-500">{username}:</h1>
            <h2 className="w-full break-words bg-gray-100 p-2 rounded-md text-sm">
                {msg}
            </h2>
        </div>
    );
};
export default Msg;
