import { Sequence, interpolate, useCurrentFrame } from "remotion";

export default function Intro() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 15, 30, 50], [0.65, 0.95, 1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <Sequence durationInFrames={30}>
      <div style={{ opacity }} className="text-center max-w-[73rem] m-auto">
        <h1 className='text-8xl leading-snug'>Videoletter is the Newsletter alternative I’ve been waiting for.</h1>
      </div>
    </Sequence>
  )
}
