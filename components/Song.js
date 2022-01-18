import React from 'react';
import useSpotify from "../hooks/useSpotify";
import {millisToMinutesAndSeconds} from "../lib/time";
import {currentTrackIdState, isPlayingState} from "../atoms/songAtom";
import {useRecoilState} from 'recoil';


function Song({order, track}) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    // console.log(track?.track.album.images[0].url)
    const tr = track.track;

    const playSong = async () => {
        setCurrentTrackId((tr.id));
        setIsPlaying(true);
        spotifyApi.play({uris: [tr.uri]})
    }

    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
             onClick={playSong}>
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img className="h-10 w-10"
                     src={tr.album.images[0]?.url}
                     alt=""/>
                {/*{JSON.stringify(track.track)}*/}
                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{tr.name}</p>
                    <p className="w-40">{tr.artists[0].name}</p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 hidden md:inline">{tr.album.name}</p>
                <p>{millisToMinutesAndSeconds(tr.duration_ms)}</p>
            </div>


        </div>
    );
}

export default Song;
