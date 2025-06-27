'use client'

import { useErrorContext } from "../../context";
import { FormErrorText } from "@components/ui";

export default function AuthTitle({ title }: {
    title: string,
}) {
    const { errorText } = useErrorContext()
    return (
        <>
            <div className="flex flex-col gap-y-4">
                <h4 className="text-3xl font-bold">{title}</h4>
            </div>
            <FormErrorText errorText={errorText} />
        </>
    );
}