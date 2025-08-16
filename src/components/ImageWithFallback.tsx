import React, { useEffect, useState } from "react";

type Props = {
    src?: string;
    alt: string;
    className?: string;
    imgClassName?: string;
    fallback?: React.ReactNode;
};

export default function ImageWithFallback({
    src,
    alt,
    className,
    imgClassName,
    fallback,
}: Props) {
    const [loading, setLoading] = useState<boolean>(!!src);
    const [errored, setErrored] = useState<boolean>(!src);

    useEffect(() => {
        setLoading(!!src);
        setErrored(!src);
    }, [src]);

    return (
        <div className={className}>
            {src && !errored ? (
                <img
                    src={src}
                    alt={alt}
                    className={imgClassName}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setErrored(true);
                        setLoading(false);
                    }}
                />
            ) : null}
            {(loading || errored) && (
                <div className="w-full h-full flex items-center justify-center text-white/70">
                    {fallback ?? <span aria-hidden>🖼️</span>}
                </div>
            )}
        </div>
    );
}
