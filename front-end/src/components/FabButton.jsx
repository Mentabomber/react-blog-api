
export default function FabButton({ onClick, children }) {

    return (
      <button className="w-16 h-16 fixed bottom-4 right-4 p-4 bg-teal-500 rounded-full shadow-xl text-white text-2xl group z-40"
        onClick={onClick}>
        {children}
      </button>
    );
}