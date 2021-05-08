import React, {FunctionComponent, SelectHTMLAttributes} from "react"
import "./styles.scss"

const FormSelect: FunctionComponent<
	{
		options: {name: string; value: string | number}[]
		label?: string
	} & SelectHTMLAttributes<HTMLSelectElement>
> = ({options, label, ...selectProps}) => {
	if (!Array.isArray(options) || options.length < 1) return null

	return (
		<div className="formRow">
			{label && <label>{label}</label>}

			<select className="formSelect" {...selectProps}>
				{options.map((option, index) => {
					const {value, name} = option

					return (
						<option key={index} value={value}>
							{name}
						</option>
					)
				})}
			</select>
		</div>
	)
}

export default FormSelect
