"use client"
import { Select } from "@/components/SelectWrapper"
import { projects } from "@/data/valueAddedVaultData"
import { useQueryState } from "nuqs"

export function FilterProject() {
  const [selectedProject, setSelectedProject] = useQueryState("project")

  const handleChange = (value: string) => {
    setSelectedProject(value === "all" ? null : value)
  }

  return (
    <div className="w-full md:w-auto">
      <Select
        label="Project"
        value={selectedProject || "all"}
        onValueChange={handleChange}
      >
        <Select.Item value="all">All Projects</Select.Item>
        {projects.map((project) => (
          <Select.Item key={project.id} value={project.id}>
            {project.name}
          </Select.Item>
        ))}
      </Select>
    </div>
  )
}