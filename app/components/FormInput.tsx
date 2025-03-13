"use client";
import { ChangeEventHandler } from "react";

interface FormInputProps {
  labelText?: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  width?: string;
  height?: string;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
  required?: boolean;
}

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
