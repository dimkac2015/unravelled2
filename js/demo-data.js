// Demo playlists so the site works without Spotify keys.
// Each track carries the audio features Unravelled needs for mood analysis.

window.UNRAVELLED_DEMO = {
  storm: {
    name: "Thunder in the Cathedral",
    description: "Heavy, dark, aggressive. Riffs like falling stone.",
    tracks: [
      { name: "Ritual Fire", artists: ["Ossuary"], quote: "We built the pyre and called it prayer", tempo: 148, energy: 0.95, valence: 0.08, acousticness: 0.01, instrumentalness: 0.4, danceability: 0.45 },
      { name: "Cathedral of Salt", artists: ["Ossuary"], quote: "The salt remembers every wave that broke it", tempo: 160, energy: 0.92, valence: 0.05, acousticness: 0.02, instrumentalness: 0.6, danceability: 0.4 },
      { name: "Iron Tide", artists: ["Vermilion Hoist"], quote: "Row, you dogs, the sea is patient", tempo: 172, energy: 0.97, valence: 0.1, acousticness: 0.0, instrumentalness: 0.7, danceability: 0.5 },
      { name: "Grave Bloom", artists: ["Nightsoil Garden"], quote: "Something flowers where we buried the engine", tempo: 138, energy: 0.88, valence: 0.12, acousticness: 0.05, instrumentalness: 0.3, danceability: 0.42 },
      { name: "Wolf Season", artists: ["Nightsoil Garden"], quote: "Winter keeps its own ledger", tempo: 155, energy: 0.93, valence: 0.06, acousticness: 0.03, instrumentalness: 0.5, danceability: 0.48 },
      { name: "The Long Ash", artists: ["Furnace Choir"], quote: "Everything I loved I fed to the fire", tempo: 165, energy: 0.9, valence: 0.09, acousticness: 0.01, instrumentalness: 0.55, danceability: 0.44 },
      { name: "Blackwater Hymn", artists: ["Furnace Choir"], quote: "The river took the town and kept its name", tempo: 150, energy: 0.85, valence: 0.07, acousticness: 0.04, instrumentalness: 0.35, danceability: 0.4 }
    ]
  },
  summer: {
    name: "Sunburnt Cassette",
    description: "Up-tempo, warm, nostalgic — a summer that already ended.",
    tracks: [
      { name: "Tape Deck Sunrise", artists: ["Marigold Radio"], quote: "We played the same song till the tape wore thin", tempo: 122, energy: 0.78, valence: 0.85, acousticness: 0.3, instrumentalness: 0.05, danceability: 0.8 },
      { name: "Bike Lanes in July", artists: ["Marigold Radio"], quote: "Every green light felt like a small forgiveness", tempo: 128, energy: 0.82, valence: 0.9, acousticness: 0.2, instrumentalness: 0.02, danceability: 0.85 },
      { name: "Peach Static", artists: ["The Honolulus"], quote: "You tasted like the radio between stations", tempo: 118, energy: 0.7, valence: 0.82, acousticness: 0.35, instrumentalness: 0.0, danceability: 0.75 },
      { name: "Dial Tone Sweetheart", artists: ["The Honolulus"], quote: "I saved your laugh on the answering machine", tempo: 112, energy: 0.65, valence: 0.78, acousticness: 0.4, instrumentalness: 0.0, danceability: 0.7 },
      { name: "Sodium Light Swim", artists: ["Cassette Bay"], quote: "The pool was warm as a held hand", tempo: 125, energy: 0.75, valence: 0.88, acousticness: 0.15, instrumentalness: 0.1, danceability: 0.82 },
      { name: "Last Bus to Nowhere Nice", artists: ["Cassette Bay"], quote: "Anywhere is somewhere if you're singing", tempo: 130, energy: 0.8, valence: 0.86, acousticness: 0.18, instrumentalness: 0.03, danceability: 0.78 }
    ]
  },
  lush: {
    name: "Moss & Bramble",
    description: "Slow, lush, verdant — choirs of strings and wind.",
    tracks: [
      { name: "Bramble Choir", artists: ["Wren & the Understory"], quote: "The thicket sang us back to the road", tempo: 78, energy: 0.35, valence: 0.45, acousticness: 0.85, instrumentalness: 0.5, danceability: 0.3 },
      { name: "Cathedral Moss", artists: ["Wren & the Understory"], quote: "Green grows over everything we failed to finish", tempo: 72, energy: 0.3, valence: 0.4, acousticness: 0.9, instrumentalness: 0.65, danceability: 0.25 },
      { name: "Riverbed Lullaby", artists: ["Hallow Fen"], quote: "Carry me where the water decides", tempo: 68, energy: 0.28, valence: 0.42, acousticness: 0.88, instrumentalness: 0.6, danceability: 0.28 },
      { name: "The Hawthorn Waits", artists: ["Hallow Fen"], quote: "Patience is a tree that keeps its own time", tempo: 74, energy: 0.32, valence: 0.38, acousticness: 0.82, instrumentalness: 0.55, danceability: 0.26 },
      { name: "Wildwood Hymn", artists: ["Ember & Oak"], quote: "We were wild once, and the wood remembers", tempo: 82, energy: 0.42, valence: 0.5, acousticness: 0.8, instrumentalness: 0.45, danceability: 0.32 },
      { name: "Low Fields", artists: ["Ember & Oak"], quote: "Evening lays its long hand on the meadow", tempo: 70, energy: 0.3, valence: 0.44, acousticness: 0.87, instrumentalness: 0.58, danceability: 0.24 }
    ]
  }
};
