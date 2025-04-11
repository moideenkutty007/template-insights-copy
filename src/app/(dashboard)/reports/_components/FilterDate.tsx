import { Label } from "@/components/Label"
import { Select } from "@/components/SelectWrapper"
import { useQueryState } from "nuqs"
import { DEFAULT_RANGE, RANGE_DAYS, RANGE_LABELS, RangeKey } from "./dateRanges"

const FilterDate = () => {
  const [range, setRange] = useQueryState<RangeKey>("range", {
    defaultValue: DEFAULT_RANGE,
    parse: (value): RangeKey =>
      Object.keys(RANGE_DAYS).includes(value)
        ? (value as RangeKey)
        : DEFAULT_RANGE,
  })

  const handleValueChange = (value: RangeKey) => {
    setRange(value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="date-range" className="font-medium">
        Date Range
      </Label>
      <Select 
        value={range} 
        onValueChange={handleValueChange}
        className="w-full md:w-36"
      >
        {Object.entries(RANGE_LABELS).map(([value, label]) => (
          <Select.Item key={value} value={value}>
            {label}
          </Select.Item>
        ))}
      </Select>
    </div>
  )
}

export { FilterDate }
