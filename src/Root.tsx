import { Composition, getInputProps, staticFile } from 'remotion';
import { MyComposition, myCompSchema } from './Composition';
import './style.css';
import { getAudioData, getVideoMetadata } from '@remotion/media-utils';
import { getSrc, parseSettings } from './helpers';

export const RemotionRoot: React.FC = () => {
	const data = getInputProps();
	const fps = 30;
	const INTRO_DURATION = 30;

	const settingsArray = data.map((s) => {
		const parsed = parseSettings(s.settings.replace("--- ", ""));
		return parsed;
	});

	return (
		<Composition
			id="TechTwitter"
			component={MyComposition}
			durationInFrames={300}
			fps={30}
			width={1920}
			height={1080}
			schema={myCompSchema}
			defaultProps={{
				data
			}}
			calculateMetadata={async ({ props }) => {
	     	const totalTweets: number = props.data.length as any;
		    const audioPromises = Array.from({ length: totalTweets }, (_, i) => getAudioData(staticFile(`audio/${i + 1}.aac`)));
				const audioFiles = await Promise.all(audioPromises);
				const videoPromises = data.map((v, i) => settingsArray[i].play_full && v.tweet.tweet.video ? getVideoMetadata(v && getSrc(v.tweet.tweet.video)) : null);
				const videoDurations = await Promise.all(videoPromises);
				const durationInSeconds = audioFiles.reduce((acc, audio, index) => {
					const customDuration = videoDurations[index] ? videoDurations[index].durationInSeconds - 1 : null;
					return acc + (customDuration || audio.durationInSeconds);
				}, 0);
				const totalFrames = Math.floor(durationInSeconds * fps);
				return {
					durationInFrames: INTRO_DURATION + totalFrames,
				};
			}}
		/>
	)
};
