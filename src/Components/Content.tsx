import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Tweet } from "./Tweet";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { getAudioData } from "@remotion/media-utils";

export default function Content({ data }) {
  const lastHeadingRef = useRef(null);
  const [currentActiveTopic, setCurrentActiveTopic] = useState(0);
  const [durations, setDurations] = useState<any>([]);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const INTRO_DURATION = 30;

  const today = () => {
    const d = new Date();
    const month = d.toLocaleString("default", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  }
  const getDurationInFrame = useCallback(async (index) => {
    const audioData = await getAudioData(staticFile(`audio/${index + 1}.aac`));
    return audioData.durationInSeconds * fps;
  }, []);


  useEffect(() => {
    const audioPromises = Array.from({ length: data.length }, (_, i) => getDurationInFrame(i));
    Promise.all(audioPromises)
      .then((audioFiles) => {
        const audio = audioFiles.reduce((acc: any, duration: any, index) => {
          const from = index === 0 ? 0 : acc[index - 1].duration + acc[index - 1].from;
          return [...acc, { duration: Math.ceil(duration), from }];
        }, []);
        setDurations(audio);
      })
      .catch((error) => console.error("Error loading audio files:", error));
  }, [data, fps, getDurationInFrame]);

  useEffect(() => {
    for (let i = 0; i < durations.length; i++) {
      if (frame >= durations[i].from && frame <= durations[i].from + durations[i].duration + INTRO_DURATION) {
        setCurrentActiveTopic(i);
        break;
      }
    }
  }, [frame, durations])

  return (
    <Sequence from={INTRO_DURATION} className="flex flex-col shrink-0">
      <div className="w-[1720px] flex mt-10 justify-between ml-20 mr-20 text-3xl">
        <div>What's happened this week?</div>
        <div>Videoletter | {today()}</div>
      </div>
      <div className="w-[1750px] ml-20 mr-10 mt-10 h-full border-2 border-gray-300 rounded-t-3xl shadow-2xl overflow-hidden">
        <div className="h-full w-full flex flex-row overflow-hidden bg-white">
          <div className="w-[500px] h-full pl-8 pt-8 border-0 border-r-2 border-r-gray-200">
            {data.map((tweet: any, index: number) => {
              const canShowHeader = lastHeadingRef.current !== tweet.heading;
              lastHeadingRef.current = tweet.heading;
              return <Sidebar key={index} data={tweet} canShowHeader={canShowHeader} active={currentActiveTopic === index} />;
            })}
          </div>

          {durations.map((d, index) => {
            return (
              <Sequence key={index} durationInFrames={d.duration} from={d.from} className="pl-[550px] mt-32">
                <Tweet data={data[index].tweet.tweet} index={index + 1} />
              </Sequence>
            )
          })}
        </div>
      </div>
    </Sequence>
  )
}
