function Button({ ...props }) {
    return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full cursor-pointer hover:bg-blue-600 transition-colors active:bg-blue-700 outline-none" {...props} />
    )
}

export default Button