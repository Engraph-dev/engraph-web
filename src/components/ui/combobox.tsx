"use client"

import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

interface ComboboxProps {
	values: {
		value: string
		label: string
	}[]
	value: string
	setValue: (value: string) => void
	placeholder?: string
}
export function Combobox({
	values,
	value,
	setValue,
	placeholder = "Select a value...",
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{value
						? values.find((item) => item.value === value)?.label
						: placeholder}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[80vw] p-0 md:w-[60vw]">
				<Command className="w-full">
					<CommandInput placeholder={placeholder} className="h-9" />
					<CommandList>
						<CommandEmpty>No data found.</CommandEmpty>
						<CommandGroup>
							{values.map((item) => (
								<CommandItem
									key={item.value}
									value={item.label}
									onSelect={(currentValue) => {
										setValue(
											currentValue === value
												? ""
												: values.find(
														(item) =>
															item.label ===
															currentValue,
													)?.value || "",
										)
										setOpen(false)
									}}
								>
									{item.label}
									<Check
										className={cn(
											"ml-auto",
											value === item.value
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
