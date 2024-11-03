package song

type Song struct {
	ID           string `json:"id"`
	URL          string `json:"url"` // needs to have first upper case character (since it is public)
	Name         string `json:"name"`
	Plays        string `json:"plays"`
	SimilarSongs []Song `json:"similarSongs"`
}
