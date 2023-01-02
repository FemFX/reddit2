import React, { FC } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
}

const InputField: FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {props.textarea ? (
        <Textarea
          id={field.name}
          placeholder={props.placeholder}
          value={field.value}
          onChange={field.onChange}
          {...field}
          {...(props as any)}
        />
      ) : (
        <Input
          id={field.name}
          placeholder={props.placeholder}
          value={field.value}
          onChange={field.onChange}
          {...field}
          {...(props as any)}
        />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
