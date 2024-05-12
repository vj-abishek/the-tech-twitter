/* eslint-disable react/no-danger */
import {Audio} from 'remotion'
import { Img, Video, interpolate, random, staticFile, useCurrentFrame } from "remotion"

export const Tweet = ({ data, index }) => {
  const getSrc = (urls: { src: string }[]) => {
    const sizes = ['1280x', '720x', '480x', 'x720', 'x480', 'x360'];

    for (const size of sizes) {
      const url = urls.find((d) => d.src.includes(size));
      if (url) {
        return url.src;
      }
    }
  }

  return (
    <div className="w-[1230px] m-10 mt-0 mb-0 bg-white border-[#eff3f4] p-6 pb-0 rounded-[40px]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="shrink-0">
            <Img src={data.avatar} className="w-20 h-20 rounded-full" />
          </div>
          <div className="ml-6">
            <p className="text-2xl font-bold">{data.name}</p>
            <span className="text-xl">@{data.username}</span>
          </div>
        </div>
        <div>
          <Img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZM74c7u5dbdDk0mtxAmUOXQpyAHkMFB9HUVYKLOqAbQ&s" className="w-20 h-20 rounded-full" />
        </div>
      </div>

      <div className="flex flex-row mb-4">
        <div dangerouslySetInnerHTML={{ __html: data.text }} className="mt-7 text-3xl leading-snug"/></div>

      {data.video ? (
        <div className="mt-12 bg-black flex items-center justify-center rounded-3xl overflow-hidden border-[#eff3f4]">
          <Video
            loop
            src={getSrc(data.video)}
            className="aspect-auto h-full"
            volume={0}
          />
        </div>
      ) : (
        data.images.length ? (
          <Img className="rounded-3xl bg-black aspect-auto object-cover border-[#eff3f4]" src={data.images[0]} />
        ) : null
      )}

      <Audio src={staticFile(`audio/${index}.aac`)} />
    </div>
  )
}