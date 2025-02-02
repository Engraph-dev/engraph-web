import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { useFormErrorFormat } from "@/lib/hooks/useFormErrorFormat"
import { FieldError, UseRequestFormRet } from "@/lib/hooks/useRequestForm"
import React from "react"

type CommonFieldProps<
	T,
	InputPropsBaseType = React.InputHTMLAttributes<HTMLInputElement>,
	ParamT extends Record<string, never> = Record<string, never>,
	BodyT extends Record<string, never> = Record<string, never>,
	QueryT extends Record<string, never> = Record<string, never>,
> = {
	form: UseRequestFormRet<ParamT, BodyT, QueryT> | null
	label: string | React.ReactNode | (() => React.ReactNode)
	inputProps: InputPropsBaseType & {
		name: string
	}
	containerProps?: React.HTMLAttributes<HTMLDivElement>
	fieldErrors?: FieldError[]
	renderErrors?: (errors: FieldError[]) => React.ReactNode
}

export type TextFieldProps<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = CommonFieldProps<
	string,
	React.InputHTMLAttributes<HTMLInputElement>,
	ParamT,
	BodyT,
	QueryT
> & {
	inputProps: React.InputHTMLAttributes<HTMLInputElement> & {
		type?: "text" | "password" | "email" | "tel" | "url"
	}
}

export function TextField<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
>({
	useStyled = true,
	...props
}: TextFieldProps<ParamT, BodyT, QueryT> & { useStyled?: boolean }) {
	const resolvedId =
		props.inputProps.id || `text-field-${props.inputProps.name.toString()}`

	const formatFn = useFormErrorFormat()

	const { renderErrors = formatFn } = props

	const renderLabel =
		typeof props.label !== "string" ? (
			typeof props.label === "function" ? (
				props.label()
			) : (
				props.label
			)
		) : (
			<Label htmlFor={resolvedId} className={useStyled ? "" : ""}>
				{props.label}
			</Label>
		)

	const fieldErrors = props.fieldErrors || []

	return (
		<div
			{...props.containerProps}
			{...(useStyled
				? { className: "relative " + props.label ? "space-y-1 " : "" }
				: {})}
		>
			{renderLabel}
			{props.inputProps.type === "password" ? (
				<PasswordInput
					{...props.inputProps}
					{...(!useStyled
						? { className: props.inputProps.className }
						: {
								className: "",
							})}
				/>
			) : (
				<Input
					type={"text"}
					{...props.inputProps}
					{...(!useStyled
						? { className: props.inputProps.className }
						: {
								className: "",
							})}
				/>
			)}
			{fieldErrors.length ? renderErrors(fieldErrors) : null}
		</div>
	)
}

type TextAreaProps<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = CommonFieldProps<
	string,
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	ParamT,
	BodyT,
	QueryT
>
export function TextArea<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
>(props: TextAreaProps<ParamT, BodyT, QueryT>) {
	const resolvedId =
		props.inputProps.id || `text-area-${props.inputProps.name.toString()}`
	const renderLabel =
		typeof props.label !== "string" ? (
			typeof props.label === "function" ? (
				props.label()
			) : (
				props.label
			)
		) : (
			<label htmlFor={resolvedId}>{props.label}</label>
		)

	const formatFn = useFormErrorFormat()

	const { renderErrors = formatFn } = props

	const fieldErrors = props.fieldErrors || []
	return (
		<div {...props.containerProps}>
			{renderLabel}
			<textarea {...props.inputProps} />
			{fieldErrors.length ? renderErrors(fieldErrors) : null}
		</div>
	)
}

type NumericFieldProps<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = CommonFieldProps<
	number,
	React.InputHTMLAttributes<HTMLInputElement>,
	ParamT,
	BodyT,
	QueryT
>

export function NumberField<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
>(props: NumericFieldProps<ParamT, BodyT, QueryT>) {
	const renderLabel =
		typeof props.label === "function" ? props.label() : props.label

	const resolvedId =
		props.inputProps.id ||
		`numeric-field-${props.inputProps.name.toString()}`

	return (
		<div {...props.containerProps}>
			<label htmlFor={resolvedId}>{renderLabel}</label>
			<input {...props.inputProps} type={"numeric"} />
		</div>
	)
}

type DateFieldProps<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = CommonFieldProps<
	Date,
	React.InputHTMLAttributes<HTMLInputElement>,
	ParamT,
	BodyT,
	QueryT
>

export function DateField<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
>(props: DateFieldProps<ParamT, BodyT, QueryT>) {
	const renderLabel =
		typeof props.label === "function" ? props.label() : props.label

	const resolvedId =
		props.inputProps.id || `date-field-${props.inputProps.name.toString()}`

	const transformedValue = new Date(props.inputProps.value as string)

	return (
		<div {...props.containerProps}>
			<label htmlFor={resolvedId}>{renderLabel}</label>
			<input
				{...props.inputProps}
				type={"date"}
				value={transformedValue.toISOString().split("T")[0]}
				onChange={(ev) => {
					const finalValue = new Date(ev.target.value)
					props.inputProps.onChange?.({
						...ev,
						target: {
							...ev.target,
							value: finalValue as unknown as string,
						},
					})
				}}
				className={`${props.inputProps.className} outline-none transition-all duration-200 focus:border-purple-700 focus:ring-1 focus:ring-purple-700`}
			/>
		</div>
	)
}

type TimeFieldProps<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = CommonFieldProps<
	Date,
	React.InputHTMLAttributes<HTMLInputElement>,
	ParamT,
	BodyT,
	QueryT
>

export function TimeField<
	ParamT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
>(props: DateFieldProps<ParamT, BodyT, QueryT>) {
	const renderLabel =
		typeof props.label === "function" ? props.label() : props.label

	const resolvedId =
		props.inputProps.id || `time-field-${props.inputProps.name.toString()}`

	const transformedValue = new Date(props.inputProps.value as string)

	const timeValue = transformedValue.toLocaleTimeString("en", {
		timeStyle: "short",
		hourCycle: "h24",
	})

	return (
		<div {...props.containerProps}>
			<label htmlFor={resolvedId}>{renderLabel}</label>
			<input
				{...props.inputProps}
				type={"date"}
				value={timeValue}
				onChange={(ev) => {
					const finalValue = new Date(ev.target.value)
					props.inputProps.onChange?.({
						...ev,
						target: {
							...ev.target,
							value: finalValue as unknown as string,
						},
					})
				}}
			/>
		</div>
	)
}
