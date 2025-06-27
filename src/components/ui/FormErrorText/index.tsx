import { Fragment, ReactNode } from "react";

export default function FormErrorText({ errorText }: {
    errorText?: ReactNode
}) {
    if (!errorText) return null

    const errorMessage = Array.isArray(errorText) ?
        <>{errorText.map((item, index) => (
            <Fragment key={index}>
                {item}
                {index < errorText.length - 1 && <br />}
            </Fragment>
        ))}</> : errorText

    return (
        <div className="self-stretch px-4 py-3 mix-blend-multiply bg-red-100 rounded-lg justify-start items-center gap-3 inline-flex">
            <div className="w-6 h-6 flex items-center justify-center">
                {/* <IconError name="error" className="text-red-700 text-2xl" /> */}
            </div>
            <div className="text-red-700 text-base font-medium transition-all duration-300">
                {errorMessage}
            </div>
        </div>
    );
}