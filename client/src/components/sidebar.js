import { FaArrowsAltH } from 'react-icons/fa';

export default function Sidebar(props) {
  return (
    <>
      <div
        className={`bg-white border-0 border-l border-solid border-stroke p-1 absolute top-0 h-full w-[20vw] transition-[right] duration-300 ease-in-out ${
          props.isOpen ? 'right-0' : '-right-[18vw]'
        }`}
      >
        <div className="flex">
          <button onClick={props.toggleSidebar} className="bg-transparent h-fit">
            <FaArrowsAltH />
          </button>
          <div>
            {/* <Editor /> */}
          </div>
        </div>
      </div>
    </>
  );
}
