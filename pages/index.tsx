import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Song from "../components/Song/Song";
import Audio from "../components/Audio/Audio"

type Song = {
  id: number,
  title: string,
  artist: string,
  file: string,
  image: string,
}

export async function getStaticProps() {
  const data: Song[] = await import(`../data/songs.json`);
  const songs = await JSON.parse(JSON.stringify(data))

  return {
    props: {songs},
    revalidate: 3600,
  };
}

const Home: NextPage<{ songs: Song[] }> = ({songs}) => {
  const [trackPlaying, setTrackPlaying] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div className={styles.songPlaying}>
        <Song song={songs[trackPlaying]} isPlaying={isPlaying} />
      </div>
      <Audio
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        songs={songs}
        trackPlaying={trackPlaying}
        setTrackPlaying={setTrackPlaying}
      />
    </div>
  );
};

export default Home;
