import { AbsoluteFill } from 'remotion';
import { Logo } from './Logo';
import { Subtitle } from './Subtitle';
import { Title } from './Title';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';
import { loadFont } from "@remotion/google-fonts/Recursive";
import Background from './Components/Background';
import Intro from './Components/Intro';
import Content from './Components/Content';

const { fontFamily } = loadFont();

export const myCompSchema = z.object({
	data: z.object({}),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
	data
}) => {
	return (
		<AbsoluteFill style={{ fontFamily }}>
			<AbsoluteFill>
				<Background />
			</AbsoluteFill>
			<AbsoluteFill>
				<Intro />
				<Content data={data}/>
			</AbsoluteFill>
			{/* <div className="m-10" />
			<Logo logoColor={propThree} />
			<div className="m-3" />
			<Title titleText={propOne} titleColor={propTwo} />
			<Subtitle /> */}
		</AbsoluteFill>
	);
};
