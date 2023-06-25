import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LineChart, Area, AreaChart } from "recharts"

interface Props {
	data: {
		label: string
		value: number
	}[]
	yLabel: string
}

const CustomLineChart: React.FC<Props> = ({ data, yLabel }) => {
	return (
		<ResponsiveContainer height={450} width="100%">
			<AreaChart margin={{ top: 32, right: 12, bottom: 60 }} data={data}>
				<defs>
					<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#82ca9d" stopOpacity={0.15} />
					</linearGradient>
				</defs>
				<CartesianGrid vertical={false} height={5} />
				<XAxis dataKey="label" className="text-sm" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Area type="monotone" dataKey="value" name={yLabel} stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
			</AreaChart>
		</ResponsiveContainer>
	)
}

export default CustomLineChart
