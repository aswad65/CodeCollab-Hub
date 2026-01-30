Place your HLS playlists (.m3u8) and segment files (.ts) in this folder.

- A playlist named `stream.m3u8` will be available at: http://localhost:5000/hls/stream.m3u8
- You can list available playlists from the backend API: GET http://localhost:5000/api/hls/list

For quick testing this repo includes a sample `stream.m3u8` that references an external sample stream.

To serve your own HLS export from ffmpeg, generate the playlist and segments and put them here (or change the path). Restart the server after adding files.