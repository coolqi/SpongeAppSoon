import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitives } from "radix-ui";
import { forwardRef } from "react";

const SelectRoot = SelectPrimitives.Root;
export const SelectValue = SelectPrimitives.Value;
const SelectIcon = SelectPrimitives.Icon;
const SelectContent = SelectPrimitives.Content;
const SelectViewport = SelectPrimitives.Viewport;
const SelectItemText = SelectPrimitives.ItemText;
export const SelectTrigger = SelectPrimitives.Trigger;

export const SelectGroup = SelectPrimitives.Group;
export const SelectLabel = SelectPrimitives.Label;

export interface SelectProps
  extends Omit<SelectPrimitives.SelectTriggerProps, "prefix"> {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  prefix?: React.ReactNode;
  dropdownClassName?: string;
  sideOffset?: number;
  displayedValue?: React.ReactNode;
  onValueChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      prefix,

      name,
      value,
      defaultValue,
      placeholder = 'Select',
      readOnly,
      disabled,
      required,
      sideOffset = 0,

      hidden,
      className,
      dropdownClassName,
      children,
      displayedValue,

      onValueChange,
      ...restProps
    },
    ref
  ) => {
    if (hidden) {
      return null;
    }

    return (
      <SelectRoot
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        open={readOnly ? false : undefined}
        autoComplete="off"
      >
        <SelectTrigger
          ref={ref}
          className={cn(
            "group flex items-center justify-between relative h-[45px] w-full rounded shadow-inner-green bg-green-light px-3.5 text-left text-black outline-none transition-colors duration-150 ease-linear focus-within:border-blue focus-within:shadow-field disabled:cursor-not-allowed disabled:bg-grey-hover disabled:text-grey-dark data-[state=open]:bg-grey-light data-[placeholder]:text-grey-dark data-[placeholder]:font-xl data-[placeholder]:font-medium disabled:data-[placeholder]:text-grey-tertiary",
            className
          )}
          data-name={name}
          {...restProps}
        >
          <SelectValue placeholder={placeholder} className="font-semibold text-xl" />
          <SelectIcon>
            <ChevronDownIcon className="w-4 absolute right-2 top-1/2 -translate-y-1/2 transition-transform group-data-[state=open]:rotate-180" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent
          position="popper"
          align="start"
          sideOffset={sideOffset}
          collisionPadding={10}
          className={cn(
            "z-[500] max-h-[--radix-select-content-available-height] w-[--radix-select-trigger-width] min-w-[140px] overflow-y-auto rounded-md bg-green-light border-green-lighter border-2",
            dropdownClassName
          )}
        >
          <SelectViewport>{children}</SelectViewport>
        </SelectContent>
      </SelectRoot>
    );
  }
);

export type SelectItemProps = SelectPrimitives.SelectItemProps & {
  hideIndicator?: boolean;
};

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  (
    {
      value,
      textValue,
      disabled,
      hidden,
      className,
      children,
      hideIndicator,
      ...restProps
    },
    ref
  ) => {
    if (hidden) {
      return null;
    }

    return (
      <SelectPrimitives.Item
        ref={ref}
        value={value}
        textValue={textValue}
        disabled={disabled}
        className={cn(
          "p-0 bg-green-light border-b-2 last-of-type:border-none border-green-lighter hover:bg-green-dark active:bg-green-dark relative cursor-pointer py-1.5 pl-4 transition-colors duration-150 ease-linear data-[disabled]:cursor-not-allowed data-[disabled]:bg-transparent data-[highlighted]:bg-grey-light data-[disabled]:text-grey-mid",
          className
        )}
        {...restProps}
      >
        <SelectItemText>{children}</SelectItemText>
      </SelectPrimitives.Item>
    );
  }
);

Select.displayName = "Select";
SelectItem.displayName = "SelectItem";
