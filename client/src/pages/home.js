import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTournament, getTournamentQuestionCounts, getTournaments } from '../lib/api';

export default function Home() {
  const [tournament, setTournament] = useState(null)
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const sequence = async () => {
      const tournaments = await getTournaments();
      setTournament(tournaments[0]);
      const counts = await getTournamentQuestionCounts(tournaments[0]?.id);
      setCounts(counts);
    }

    try {
      sequence()
    } catch (err) {
      console.error(err)
    }
  }, [])


  // useEffect(() => {
  //   getTournamentQuestionCounts(tournament?.id).then(setCounts).catch(console.error);
  // }, [])
  
    return <>
    <div class="flex flex-col p-12 gap-8 w-1/2 h-full">
      <div
        className="font-heading font-normal text-[3em] text-left bg-white py-1"
        style={{ fontVariationSettings: "'SHRP' 50" }}
      >
        <span className="text-primary no-underline">
          Quote
        </span>
      </div>
      <div className="flex flex-col rounded-lg border-stroke-light bg-primary-light p-8 gap-6 w-full h-2/5">
        <span className="text-canvas font-normal text-2xl font-mono">CURRENTLY OPEN</span>
        <span className="text-6xl">{tournament?.name}</span>
        <div class="flex gap-2 text-2xl text-ink-subtle font-normal font-mono items-center"><span>Collegiate</span><span>&bull;</span><span>{`${tournament?.numberOfPackets} packets`}</span>
          <span className="justify-center">&bull;</span><span>due {tournament?.dueDate ?? `unknown`} </span></div>
          <div className="flex flex-col gap-2 text-ink-subtle">
        Your Other Tournaments
          </div>
          <div className="flex gap-6">

          {counts?.map((data) => (
            <div className="flex w-full flex-col p-8 gap-2 border-stroke bg-white rounded-xl">
            <span className="text-2xl font-mono text-ink-subtle">{data?.status}</span><span className="text-4xl">{data?._count?._all}</span>
          </div>))}
        
        </div>
        <div className="flex gap-4">
        <Link to={`/tournament/${tournament?.id}/set-overview`} className="p-8 text-white text-4xl border-stroke bg-primary border-black rounded-lg shadow-md">{"Jump In ->"}</Link>
        <div className="p-8 text-4xl border-dashed border-black rounded-xl shadow-md">{"See Packets ->"} </div>

        </div>
      </div>
      Your Other Tournaments
      <div className="flex w-3/5">
      <div className="flex flex-col p-8 border-dashed w-1/5 items-center justify-center text-2xl rounded-lg">
      <span>+ new</span>
      <span className="font-mono text-ink-subtle">0 archived</span></div>
      </div>
    </div>
  </>; 
}