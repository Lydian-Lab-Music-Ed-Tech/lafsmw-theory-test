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
  required = false,
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
          fontSize: "12px",
          textAlign: "center",
          height,
          margin: "0px",
          width,
          borderBottom: "1px solid",
          backgroundColor: "transparent",
        }}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
