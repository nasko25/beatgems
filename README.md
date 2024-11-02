# beatgems

An AI-generated beats library

## Functionality

Plan is to have 2 main features:

1. A library of pre-generated AI beats
2. A way to generate artist type beats using https://www.stableaudio.com/ (according to https://stability.ai/news/stable-audio-2-0 they should release an API at some point)
   It is unfeasible to fine-tune a model for several artist type beats right now, and I doubt the audiocraft models will be good enough

Audio playback with waveforms seems to be a bit more complicated than I had hoped. For now I will just serve static mp3 files through an API using the wavesurfer library.

Otherwise, something like https://github.com/serversideup/amplitudejs could be cool, but still would require UI customizations. I really like the wavesurfer visualization and I'd like to keep using it.

### TODO

- [x] Fine-tune model
- [x] [Migrate to vite](https://coreui.io/blog/how-to-migrate-create-react-app-to-vite/)...

- [ ] Migrate frontend + backend to something like NestJS
- [ ] implement server-side routing in place of `react-router-dom` (since react router has problems with navigating to html sections by id, but also client-side routing is not ideal)

- [ ] Frontend beat library page
- [ ] API
      authentication to each endpoint!

After having a working UI and audio files:

- [ ] File download on demand (on playing selected audio file)

And only after that focus on:

- [ ] ? Streaming files with wavesurfer: https://github.com/katspaugh/wavesurfer.js/issues/1932#issuecomment-1782804474:

  1. Have backend serve right MIME type and supports [time range requests](https://developer.mozilla.org/en-US/docs/Web/Media/Audio_and_video_delivery/buffering_seeking_time_ranges) (should be pretty standard)
  2. Extract peaks and duration and include it in an API endpoint: https://github.com/katspaugh/wavesurfer.js/discussions/3578
     You can extract the peaks from the audiodata using something like https://github.com/bbc/audiowaveform or ffmepg

- [ ] Add a plays/downloads counter and likes/dislikes

- [ ] Generate some parts of a song separately (for example a "clean beat with no other instruments" and a "hip hop bass line") and combine them into one song
      Specifying a BPM during the generation should fix the recordings being out of sync
      Hopefully this would also fix the "phantom bass" sounds (where the bass line sounds as if it's merged with the beat entirely) in many of the generated beats.
