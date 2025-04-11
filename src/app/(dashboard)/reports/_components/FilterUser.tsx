"use client"
import { Select } from "@/components/SelectWrapper"
import { users } from "@/data/valueAddedVaultData"
import { useQueryState } from "nuqs"

export function FilterUser() {
  const [selectedUser, setSelectedUser] = useQueryState("user")

  const handleChange = (value: string) => {
    setSelectedUser(value === "all" ? null : value)
  }

  return (
    <div className="w-full md:w-auto">
      <Select
        label="User"
        value={selectedUser || "all"}
        onValueChange={handleChange}
      >
        <Select.Item value="all">All Users</Select.Item>
        {users.map((user) => (
          <Select.Item key={user.id} value={user.id}>
            {user.name}
          </Select.Item>
        ))}
      </Select>
    </div>
  )
}