import "./App.css";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // for card overlay

  useEffect(() => {
    const authParams = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  async function search() {
    const artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      artistParams
    )
      .then((res) => res.json())
      .then((data) => data.artists.items[0].id);

    const albumData = await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
      artistParams
    )
      .then((res) => res.json())
      .then((data) => data.items);

    setAlbums(albumData);
  }

  const carouselResponsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  const openCard = (album) => setSelectedAlbum(album);
  const closeCard = () => setSelectedAlbum(null);

  return (
    <>
      <div className="aurora-background"></div>

      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        {/* Headings */}
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "60px",
            fontWeight: 800,
            color: "white",
            marginBottom: "0px",
            textAlign: "center",
          }}
        >
          Playlist
        </h1>
        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "32px",
            marginTop: "0px",
            fontWeight: 600,
            color: "white",
            marginBottom: "0.5px",
            textAlign: "center",
          }}
        >
          Finder
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            color: "white",
            textAlign: "center",
            maxWidth: "500px",
            marginBottom: "30px",
          }}
        >
          Discover albums by your favorite artists quickly and easily.
        </p>

        {/* Search bar */}
        <Container
          style={{
            backgroundColor: "#1a1a1a",
            color: "white",
            padding: "20px",
            border: "1px solid #ffffff33",
            borderRadius: "30px",
            marginBottom: "20px",
          }}
        >
          <InputGroup>
            <FormControl
              placeholder="Search For Artist"
              type="input"
              aria-label="Search for an Artist"
              onKeyDown={(event) => {
                if (event.key === "Enter") search();
              }}
              onChange={(event) => setSearchInput(event.target.value)}
              style={{
                marginBottom: "10px",
                width: "300px",
                height: "35px",
                borderWidth: "0px",
                borderStyle: "solid",
                borderRadius: "5px",
                marginRight: "10px",
                paddingLeft: "10px",
                fontFamily: "'Poppins', sans-serif",
              }}
            />
            <Button onClick={search}>Search</Button>
          </InputGroup>
        </Container>

        {/* Carousel */}
        <Container style={{ width: "90%", maxWidth: "1200px", marginBottom: "30px" }}>
          <Carousel
            responsive={carouselResponsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            showDots={true}
            removeArrowOnDeviceType={["mobile"]}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-10-px"
          >
            {albums.map((album) => (
              <div
                key={album.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "10px",
                }}
                onClick={() => openCard(album)}
              >
                <img
                  src={album.images[0]?.url || ""}
                  alt={album.name}
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  {album.name}
                </p>
              </div>
            ))}
          </Carousel>
        </Container>

        {/* Overlay card for album details */}
        {selectedAlbum && (
          <div
            onClick={closeCard}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside card
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "15px",
                textAlign: "center",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={selectedAlbum.images[0]?.url || ""}
                alt={selectedAlbum.name}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  marginBottom: "15px",
                }}
              />
              <h3 style={{ fontFamily: "'Poppins', sans-serif" }}>{selectedAlbum.name}</h3>
              <p style={{ fontFamily: "'Poppins', sans-serif" }}>Release Date: {selectedAlbum.release_date}</p>
              <Button
                href={selectedAlbum.external_urls.spotify}
                target="_blank"
                style={{
                  backgroundColor: "#1DB954",
                  border: "none",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  borderRadius: "5px",
                  padding: "8px 15px",
                }}
              >
                Listen on Spotify
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
