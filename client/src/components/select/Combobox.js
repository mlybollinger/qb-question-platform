import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'



export function ComboBox({options, selected, setSelected}) {
  const [query, setQuery] = useState('')


  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase())
        })
  
  return (
    <div class="flex flex-col">
    <Combobox immediate value={selected} onChange={(value) => setSelected(value)} onClose={() => setQuery('')}>
      <ComboboxInput
        className="p-1"
        displayValue={(option) => option?.name}
        onChange={(event) => setQuery(event.target.value)}
      >
      </ComboboxInput>
      <ComboboxOptions  anchor="bottom" className="z-10 border-solid p-1">

        {filteredOptions.length 
         ? filteredOptions.map((option) => ( 
          <ComboboxOption key={option.id} value={option} className="data-focus:bg-blue-100 hover:cursor-pointer hover:bg-cyan-100">
            {option.name}
          </ComboboxOption>
        ))
        : "No options available"
        }

      </ComboboxOptions>
    </Combobox>
    </div>
  )
}
