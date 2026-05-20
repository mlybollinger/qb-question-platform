
export function TabGroup ({tabs, selected, setSelection, className }) {
  return (
    <>
    <div className={`flex ${className}`}>
    <div className="flex shrink border-solid border-primary-dark rounded-md">
      {tabs.map((tab) => {
        return <div className={`p-1 items-center justify-center hover:cursor-pointer ${selected === tab.id ? "bg-primary-dark text-white" : ""}`}
        onClick={() => setSelection(tab.id)}>
          {tab.name}
          </div>
      })
    }
    </div>
    </div>
</>
  )
}