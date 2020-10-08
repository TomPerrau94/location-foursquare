import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import axios from "axios";
import Venue from "../components/Venue";
import loading from "../assets/images/loading.svg";

const Home = () => {
  const [userLocation, setUserLocation] = useState({});
  const [permissionStatus, setPermissionStatus] = useState();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const otherLocations = [
    { latitude: 48.8534, longitude: 2.3488 },
    { latitude: 45.75801, longitude: 4.8001016 },
    { latitude: 43.280555, longitude: 5.2404135 },
    { latitude: 44.8638282, longitude: -0.6561806 },
    { latitude: 48.5692059, longitude: 7.6920545 },
  ];

  const ref = useRef();

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  // Get user location coordinates
  useEffect(() => {
    const getUserLocation = () => {
      navigator.geolocation.watchPosition(positionGranted, positionDenied);
    };

    const positionGranted = (position) => {
      setPermissionStatus(true);
      if (!userLocation.latitude && !userLocation.longitude) {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } else {
        if (
          userLocation.latitude !== position.coords.latitude &&
          userLocation.longitude !== position.coords.longitude
        ) {
          const newLocation = { ...userLocation };
          newLocation.latitude = position.coords.latitude;
          newLocation.longitude = position.coords.longitude;
          setUserLocation(newLocation);
        }
      }
    };

    const positionDenied = () => {
      setPermissionStatus(false);
    };

    getUserLocation();
  }, [userLocation]);

  // Fetch data from Foursquare API with user coordinates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.foursquare.com/v2/venues/search?client_id=${process.env.REACT_APP_FSQ_CLIENT_ID}&client_secret=${process.env.REACT_APP_FSQ_SECRET_ID}&v=${process.env.REACT_APP_FSQ_V}&ll=${userLocation.latitude}, ${userLocation.longitude}&intent=checkin&radius=200&limit=20`
        );
        const venuesByDistance = response.data.response.venues.sort((a, b) =>
          a.location.distance > b.location.distance
            ? 1
            : b.location.distance > a.location.distance
            ? -1
            : 0
        );

        // Fetch likes for each venue and update data
        const venuesCopy = [...venuesByDistance];
        for (let i = 0; i < venuesCopy.length; i++) {
          let id = venuesCopy[i].id;
          try {
            const secondResponse = await axios.get(
              `https://api.foursquare.com/v2/venues/${id}?client_id=${process.env.REACT_APP_FSQ_CLIENT_ID}&client_secret=${process.env.REACT_APP_FSQ_SECRET_ID}&v=${process.env.REACT_APP_FSQ_V}`
            );

            venuesCopy[i].likes =
              secondResponse.data.response.venue.likes.count;
          } catch (error) {
            console.log("second request error : ", error.message);
          }
        }
        setData(venuesCopy);
        setIsLoading(false);
      } catch (error) {
        console.log("first request error : ", error.message);
      }
    };

    if (userLocation.latitude && userLocation.longitude) {
      fetchData();
    }
  }, [isLoading, userLocation]);

  return (
    <>
      <section id="hero">
        <div className="wrapper">
          <h1>Find the nearest venues</h1>
          <p>
            Get nearby venues listed by Foursquare API just by allowing the
            browser to use geolocation
          </p>
          <div>
            <Button
              label="Explore Venues"
              className="buttonPrimary"
              action={() => scrollToRef(ref)}
            />
            <Button
              label="Change location"
              className="buttonSecondary"
              action={() => {
                setIsLoading(true);
                const newLocation =
                  otherLocations[
                    Math.floor(Math.random() * otherLocations.length)
                  ];
                setUserLocation(newLocation);
              }}
            />
          </div>
        </div>
      </section>
      <section id="list">
        <div className="wrapper">
          <h2 ref={ref}>List of venues</h2>

          {isLoading && permissionStatus !== false ? (
            <div className="loading">
              <img src={loading} alt="" />
            </div>
          ) : (
            <>
              <p className="around">
                Around{" "}
                <a
                  href={`https://www.google.fr/maps/search/${userLocation.latitude},${userLocation.longitude}/@${userLocation.latitude},${userLocation.longitude}z`}
                  className="linkMaps"
                  alt="linkMaps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userLocation.latitude}, {userLocation.longitude}
                </a>
              </p>
              <div className="venues">
                {data.map((venue, index) => {
                  return <Venue venue={venue} key={index} />;
                })}
              </div>
            </>
          )}
          {permissionStatus === false && (
            <div className="geolocationError">
              <p>
                <i className="icon-exclamation_c_fill"></i> Please allow
                geolocation
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
