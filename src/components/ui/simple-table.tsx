import React from "react"

export interface SimpleTableProps {
	rows: {
		name: string
		value: string | number
	}[]
}

export const SimpleTable: React.FC<SimpleTableProps> = ({ rows }) => {
	return (
		<table className="w-full">
			<tbody>
				{rows.map((row) => (
					<tr key={row.name} className="m-0 border-t p-0 even:bg-muted">
						<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
							{row.name}
						</td>
						<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right font-bold">
							{row.value}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
