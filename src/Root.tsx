import { Composition, getInputProps, staticFile } from 'remotion';
import { MyComposition, myCompSchema } from './Composition';
import './style.css';
import { getAudioData } from '@remotion/media-utils';

export const RemotionRoot: React.FC = () => {
	const data = getInputProps();
	const fps = 30;
	const INTRO_DURATION = 30;

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
				const durationInSeconds = audioFiles.reduce((acc, audio) => acc + audio.durationInSeconds, 0);
				const totalFrames = Math.floor(durationInSeconds * fps);
				return {
					durationInFrames: INTRO_DURATION + totalFrames,
				};
			}}
		/>
	)
};
