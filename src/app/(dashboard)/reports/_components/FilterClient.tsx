"use client"
import { Select } from "@/components/SelectWrapper"
import { clients } from "@/data/valueAddedVaultData"
import { useQueryState } from "nuqs"

export function FilterClient() {
  const [selectedClient, setSelectedClient] = useQueryState("client")

  const handleChange = (value: string) => {
    setSelectedClient(value === "all" ? null : value)
  }

  return (
    <div className="w-full md:w-auto">
      <Select
        label="Client"
        value={selectedClient || "all"}
        onValueChange={handleChange}
      >
        <Select.Item value="all">All Clients</Select.Item>
        {clients.map((client) => (
          <Select.Item key={client.id} value={client.id}>
            {client.name}
          </Select.Item>
        ))}
      </Select>
    </div>
  )
}