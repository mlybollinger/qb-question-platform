import { Link, useParams } from "react-router-dom";
import { FaBell, FaChevronDown } from "react-icons/fa";

const setName = "2023 Chicago Open";

export default function Navbar() {
  const { tournamentId } = useParams();
  const t = `/tournament/${tournamentId}`;
  return (
    <nav className="flex flex-col bg-transparent w-[200px] min-w-[200px] border-0 border-r border-solid border-stroke">
      <div
        className="font-heading font-normal text-[3em] text-center bg-white py-1 border-0 border-b border-solid border-stroke"
        style={{ fontVariationSettings: "'SHRP' 50" }}
      >
        <Link to="/" className="text-primary no-underline">
          Quote
        </Link>
      </div>
      <div className="flex border-0 border-b border-solid border-stroke">
        <div className="flex flex-col [flex-grow:2] py-5 pl-5">
          <span className="text-2xl">{setName}</span>
          <span>
            Change Set <FaChevronDown />
          </span>
        </div>
        <div className="flex min-w-[56px] bg-canvas text-primary text-[32px] items-center justify-center">
          <FaBell />
        </div>
      </div>
      <ul className="flex flex-col list-none pl-4">
        <Link to="/" className="text-primary underline-offset-[0.25em] py-2 px-4 font-body">
          Home
        </Link>
        <li className="text-primary underline-offset-[0.25em] py-2 px-4 font-body">Writing</li>
        <ul className="flex flex-col list-none pl-4">
          <Link to={`${t}/editor`} className="text-primary underline-offset-[0.25em] py-2 pr-4 pl-2">
            Question Writer
          </Link>
          <Link to={`${t}/all-questions`} className="text-primary underline-offset-[0.25em] py-2 pr-4 pl-2">
            All Questions
          </Link>
        </ul>
        <li className="text-primary underline-offset-[0.25em] py-2 px-4 font-body">Editing</li>
        <ul className="flex flex-col list-none pl-4">
          <Link to={`${t}/set-overview`} className="text-primary underline-offset-[0.25em] py-2 pr-4 pl-2">
            Set Overview
          </Link>
          <Link to={`${t}/packetizing`} className="text-primary underline-offset-[0.25em] py-2 pr-4 pl-2">
            Packetizing
          </Link>
          <Link to={`${t}/set-admin`} className="text-primary underline-offset-[0.25em] py-2 pr-4 pl-2">
            Set Admin
          </Link>
        </ul>
      </ul>
    </nav>
  );
}
