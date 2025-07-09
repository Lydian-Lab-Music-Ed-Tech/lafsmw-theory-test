"use client";
import { FormInputProps } from "../lib/types";

export default function FormInput({
  labelText = "",
  name,
  type = "text",
  value,
  placeholder,
  maxLength,
  width,
  height = "30px",
  onChange,
  fontSize = "12px",
  required = false,
  textAlign = "center",
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={name}>{labelText}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          fontSize,
          textAlign,
          height,
          margin: "0px",
          width,
          border: "none",
          borderBottom: "1px solid black",
          backgroundColor: "transparent",
        }}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
