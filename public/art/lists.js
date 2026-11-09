/* Unravelled — id libraries (section 7). Single source of truth:
   used by the client art code and by server-side validation. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.ART_LISTS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return {
    SCENES: ['ocean_ship','river','forest','autumn_woods','birch_forest','desert','mountains','volcano','night_city','rainy_street','snowfield','meadow_summer','lavender_fields','thunderstorm','space','swamp','sea_cliffs','lighthouse','canyon','northern_lights','savanna_sunset','cherry_blossom_hill','neon_highway','ruined_castle'],
    PALETTES: ['ember','deep_forest','golden_hour','midnight_blue','neon_night','dusty_sand','ice','storm_grey','violet_dusk','sea_teal','rose_dawn','moss_amber','copper_noir','lavender_haze','blood_moon','mint_cool'],
    ICONS: ['top_hat','pickaxe','rocket','gramophone','sailing_ship','castle','lantern','steam_train','compass','typewriter','vinyl_record','rotary_phone','radio_tube','windmill','knight_helmet','pagoda','pyramid','longship','cassette','neon_sign','robot_head','hot_air_balloon','spyglass','clock_gears'],
    BACKDROPS: ['sunburst','art_deco_fan','blueprint_grid','damask','halftone','starfield','waves','parchment'],
    SPECIES: ['human','robot','animal'],
    ANIMALS: ['cat','dog','fox','bear','rabbit','bird','mouse','wolf'],
    BODIES: ['slim','average','stocky','tall','small'],
    SKINS: ['fair','light','olive','tan','brown','dark'],
    HEADS: ['oval','square_jaw','round','long','heart','wide'],
    HAIRS: ['bald','buzz','short_side_part','slick_back','long_straight','long_wavy','curly','afro','bob','ponytail','bun','braids','mohawk','wild_spiky'],
    FACIAL: ['none','stubble','mustache','full_beard','goatee','sideburns'],
    HEADWEAR: ['none','fedora','top_hat','beret','cap','helmet','hood','cowboy_hat','crown','witch_hat','headband','feather_hat'],
    OUTFITS: ['trench_coat','suit','military_jacket','dress','cloak','leather_jacket','hoodie','armor','lab_coat','overalls','poncho','robe','space_suit','tuxedo'],
    ACCESSORIES: ['none','glasses','round_glasses','scarf','tie','eyepatch','earring','necklace','goggles','mask'],
    PROPS: ['none','sword','umbrella','guitar','book','lantern','suitcase','coffee_cup','staff','magnifier','camera','flower','backpack','microphone','telescope','broom'],
    POSES: ['standing_front','three_quarter','leaning_wall','sitting','walking','looking_up','arms_crossed','hand_in_pocket'],
    EXPRESSIONS: ['neutral','smirk','sad','angry','dreamy','surprised','tired','determined'],
    FIGURE_BACKGROUNDS: ['venetian_blinds','streetlamp_night','doorway_light','rainy_window','brick_wall','curtain','smoke_haze','spotlight'],
    COMPOSITIONS: ['lone_figure_road','two_silhouettes_facing','skyline_with_moon','ship_at_sea','car_at_night','window_view','doorway_light','rooftop','train_station','forest_path','crowd_figure','empty_chair_room','mountain_climb','ocean_wave'],
    ELEMENTS: ['streetlamp','moon','car','train','house','tree','umbrella','ship','bridge','tower','birds','clock','bicycle','balloon','lighthouse','campfire','bench','suitcase','telescope','cat'],
    ACTIVITIES: ['night_drive','cooking','reading_by_window','running','walking_in_rain','road_trip','cleaning_to_music','painting','fishing','coffee_in_cafe','stargazing','working_late','dancing_alone','cycling','gardening','train_ride','campfire_night','workout_gym','skating','writing_letters','baking','swimming_at_dusk','hiking','playing_guitar','wandering_old_city'],
    SLOTS: ['ink','shadow','base','mid','light','accent'],
    TIMES: ['dawn','day','golden','dusk','night'],
    WEATHERS: ['clear','cloudy','rain','snow','fog','storm'],
    TEMPO: ['slow','mid','fast','mixed']
  };
});
