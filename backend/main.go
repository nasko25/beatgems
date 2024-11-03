package main

import (
	"backend/song"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "api handling /%s", r.URL.Path[1:])
}

/*
[
  {
    id: "1",
    name: "Sunset Serenade",
    plays: 1234,
    url: "/tmpf1u8uoge.wav",
    similarSongs: [
      {
        id: "1a",
        name: "Moonlight Sonata",
        plays: 0,
        url: "/tmpf1u8uoge.wav",
        similarSongs: [],
      },
    ],
  },
  {
    id: "2",
    name: "Urban Rhythm",
    plays: 5678,
    url: "/temp2.wav",
    similarSongs: [],
  },
]
*/
// NOTE: song id should be unique!!!
func handleSongs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(404)
		fmt.Fprint(w, "404 Not Found")
		return
	}
	songs := []song.Song{{
		ID:    "1",
		Name:  "Sunset",
		Plays: "1234",
		URL:   "/tmpf1u8uoge.wav",
		SimilarSongs: []song.Song{
			{
				ID:           "1a",
				Name:         "Moonlight",
				Plays:        "0",
				URL:          "/tmpf1u8uoge.wav",
				SimilarSongs: []song.Song{},
			},
		},
	},
		{
			ID:           "2",
			Name:         "Rhythm",
			Plays:        "5678",
			URL:          "/temp2.wav",
			SimilarSongs: []song.Song{},
		}}
	// songs[0] = song.Song{URL: "ayo"}
	response, err := json.Marshal(songs)

	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, string(response))
}

func main() {
	log.Println("Backend running...")
	http.HandleFunc("/", handler)
	http.HandleFunc("/songs", handleSongs)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
