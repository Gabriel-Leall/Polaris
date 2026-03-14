import { Composition, registerRoot } from "remotion";
import { ZenTimerComposition } from "./compositions/ZenTimerComposition";
import { BrainDumpComposition } from "./compositions/BrainDumpComposition";
import { HabitLoopComposition } from "./compositions/HabitLoopComposition";
import { TaskComposition } from "./compositions/TaskComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ZenTimer"
        component={ZenTimerComposition}
        durationInFrames={180} // 6 seconds at 30fps
        fps={30}
        width={520}
        height={480}
      />
      <Composition
        id="BrainDump"
        component={BrainDumpComposition}
        durationInFrames={150} // 5 seconds at 30fps
        fps={30}
        width={800}
        height={500}
      />
      <Composition
        id="HabitLoop"
        component={HabitLoopComposition}
        durationInFrames={210} // 7 seconds at 30fps
        fps={30}
        width={640}
        height={440}
      />
      <Composition
        id="TaskCard"
        component={TaskComposition}
        durationInFrames={150} // 5 seconds at 30fps
        fps={30}
        width={400}
        height={400}
      />
    </>
  );
};

registerRoot(RemotionRoot);
