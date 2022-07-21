import styles from "./Song.module.css";
import Image from "next/image";

type Song = {
  id: number;
  title: string;
  artist: string;
  file: string;
  image: string;
};

export default function Song(props: { song: Song; isPlaying: boolean }) {
  return (
    <>
      <Image
        className={props.isPlaying ? styles.playing : styles.notPlaying}
        src={props.song.image}
        width={300}
        height={300}
        alt="cover"
      />
    </>
  );
}
