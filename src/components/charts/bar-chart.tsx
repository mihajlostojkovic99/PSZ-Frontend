import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts"

interface Props {
	data: {
		label: string
		value: number
	}[]
	yLabel: string
}

const CustomBarChart: React.FC<Props> = ({ data, yLabel }) => {
	return (
		<ResponsiveContainer height={450} width="100%">
			<BarChart layout="horizontal" margin={{ top: 32, right: 12, bottom: 60 }} data={data}>
				<CartesianGrid vertical={false} height={5} />
				<XAxis dataKey="label" className="text-sm" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="value" name={yLabel} fill="#82ca9d" />
			</BarChart>
		</ResponsiveContainer>
	)
}

export default CustomBarChart
