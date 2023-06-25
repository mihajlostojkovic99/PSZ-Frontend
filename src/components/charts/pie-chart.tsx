import { ResponsiveContainer, Tooltip, Legend, Pie, PieChart, Cell } from "recharts"

interface Props {
	data: {
		label: string
		value: number
	}[]
	height?: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6908a1", "#066270"]
const RADIAN = Math.PI / 180

const CustomPieChart: React.FC<Props> = ({ data, height }) => {
	return (
		<ResponsiveContainer height={height ?? 300} width="100%">
			<PieChart margin={{ top: -10, right: 0, bottom: 0 }}>
				<Tooltip />
				<Legend />
				<Pie
					data={data}
					dataKey="value"
					nameKey="label"
					cx="50%"
					cy="50%"
					fill="#82ca9d"
					labelLine={false}
					label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
						const radius = innerRadius + (outerRadius - innerRadius) * 0.5
						const x = cx + radius * Math.cos(-midAngle * RADIAN)
						const y = cy + radius * Math.sin(-midAngle * RADIAN)

						return (
							<text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
								{`${(percent * 100).toFixed(0)}%`}
							</text>
						)
					}}
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
			</PieChart>
		</ResponsiveContainer>
	)
}

export default CustomPieChart
