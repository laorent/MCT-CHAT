"use client";

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputWithLabelProps extends React.ComponentProps<"input"> {
    label: string;
    id: string;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-1.5", className)}>
        <Label htmlFor={id}>{label}</Label>
        <Input ref={ref} id={id} {...props} />
      </div>
    )
  }
)
InputWithLabel.displayName = "InputWithLabel"

export { InputWithLabel }
