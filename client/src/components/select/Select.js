import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectComponent({options, placeholder, value, setValue}) {
  return (<Select value={value} onValueChange={(v) => setValue(v)}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent position="item-aligned">
      <SelectGroup>
        {options.map((option) => <SelectItem value={option}>{option}</SelectItem>) }
      </SelectGroup>
    </SelectContent>
  </Select>)
}
