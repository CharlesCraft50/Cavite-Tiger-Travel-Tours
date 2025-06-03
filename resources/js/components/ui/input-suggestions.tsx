import React, { PropsWithChildren } from 'react'
import { Input } from './input'

type InputSuggestions = React.InputHTMLAttributes<HTMLInputElement> & {
    list: string;
}

export default function InputSuggestions({ children, list, ...props }: PropsWithChildren<InputSuggestions>) {
  return (
    <>
        <Input
            {...props}
            list={list}
        />

        <datalist id={list}>
            {children}
        </datalist>

    </>
  )
}
