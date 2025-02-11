import ClientStyle from "@/components/ux/client-css"
import React from "react"

export default function GridBackground() {
	return (
		<>
			<ClientStyle>
				{`
                    /* Main */
                    .gridBgWrapper {
                        --blockSize: calc(12.5vw);
                        --borderWidth: 1px;
                        --borderColor: hsl(0, 0%, 100%, 0.1);
                        --bgColor: var(--background);

                        /* perspective: calc(100vh / 2); */
                        perspective: 1400px;
                        overflow: hidden;

                        & * {
                            transform-style: preserve-3d;
                        }
                    }

                    .gridBg {
                        position: absolute;
                        /* inset: -200vmax; */
                        inset: 0 0 -10vmax 0;
                        background-attachment: fixed;
                        background-color: var(--bgColor);
                        background-image: linear-gradient(
                                transparent calc(var(--blockSize) - var(--borderWidth)),
                                var(--borderColor) calc(var(--blockSize) - var(--borderWidth))
                            ),
                            linear-gradient(
                                90deg,
                                transparent calc(var(--blockSize) - var(--borderWidth)),
                                var(--borderColor) calc(var(--blockSize) - var(--borderWidth))
                            );

                        background-size: var(--blockSize) var(--blockSize),
                            var(--blockSize) var(--blockSize);
                        /* background-repeat: round; */
                        /* background-position-x: calc(var(--blockSize) * 0.5 * -1); */
                        animation: gridBgMove 3s infinite linear;
                        transform-origin: top;
                        transform: rotateX(45deg);
                    }
                    .gridBgFade {
                        background-image: linear-gradient(
                                0deg,
                                var(--background) 10%,
                                transparent 25%
                            ),
                            linear-gradient(-60deg, var(--background) 15%, transparent 25%),
                            linear-gradient(-30deg, var(--background) 15%, transparent 25%),
                            linear-gradient(60deg, var(--background) 15%, transparent 25%),
                            linear-gradient(30deg, var(--background) 15%, transparent 25%);
                    }
                    @keyframes gridBgMove {
                        to {
                            background-position-y: var(--blockSize), var(--blockSize);
                        }
                    }
                    @property --imageHoverColorStop {
                        syntax: "<percentage>";
                        inherits: false;
                        initial-value: 0%;
                    }
                `}
			</ClientStyle>
			<div className="gridBgWrapper | pointer-events-none sticky top-0 -z-10 h-screen">
				<div
					className="pointer-events-none absolute right-0 top-0 -z-10 h-svh w-full -translate-y-1/4 translate-x-1/2 bg-transparent"
					style={{
						backgroundImage:
							"radial-gradient(#1D0199 , rgba(48,1,255,0) 70%)",
					}}
				/>
				<div className="gridBg | | bg-background before:absolute before:left-1/2 before:top-1/2 before:aspect-square before:w-screen before:-translate-x-1/2 before:-translate-y-1/2"></div>
			</div>
		</>
	)
}
