import { Composition, continueRender, delayRender, getInputProps, staticFile } from 'remotion';
import { MyComposition, myCompSchema } from './Composition';
import './style.css';
import { useEffect, useState } from 'react';
import { getAudioData } from '@remotion/media-utils';

export const RemotionRoot: React.FC = () => {
	const data = getInputProps();
	const [handle] = useState(() => delayRender());
	const [frameDuration, setFrameDuration] = useState(1);
	const fps = 30;
	const INTRO_DURATION = 50;

	useEffect(() => {
		const totalTweets: number = data.length as any;
		const audioPromises = Array.from({ length: totalTweets }, (_, i) => getAudioData(staticFile(`audio/${i + 1}.aac`)));

		Promise.all(audioPromises)
			.then(audioFiles => {
				const durationInSeconds = audioFiles.reduce((acc, audio) => acc + audio.durationInSeconds, 0);
				const totalFrames = durationInSeconds * fps;
				setFrameDuration(Math.round(INTRO_DURATION + totalFrames));
				continueRender(handle);
			})
			.catch(error => console.error('Error loading audio files:', error));
	}, []);

	return (
		<Composition
			id="TechTwitter"
			component={MyComposition}
			durationInFrames={frameDuration}
			fps={30}
			width={1920}
			height={1080}
			schema={myCompSchema}
			defaultProps={{
				data
			}}
		/>
	)
};
