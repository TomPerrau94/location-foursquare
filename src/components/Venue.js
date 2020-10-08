import React from "react";

const Venue = ({ venue }) => {
  return (
    <div className="venue">
      <div className="venueTop">
        <div className="venueHead">
          <h3>{venue.name}</h3>
          <div className="venueLikes">
            <span>
              <i className="icon-heart_fill"></i>
              {venue.likes}
            </span>
          </div>
        </div>
        {venue.categories.length > 0 ? (
          venue.categories.map((category, index) => {
            return (
              <div className="venueCategory" key={index}>
                <img
                  src={`${category.icon.prefix}32${category.icon.suffix}`}
                  alt="icon"
                />
                <p>{category.shortName}</p>
              </div>
            );
          })
        ) : (
          <p className="noCategory">No categories</p>
        )}
      </div>
      <div className="venueBottom">
        <div className="venueAddress">
          <i className="icon-map_pin_fill"></i>
          {venue.location.address ? (
            <a
              href={`https://www.google.fr/maps/search/${venue.location.lat},${venue.location.lng}/@${venue.location.lat},${venue.location.lng}z`}
              className="linkMaps"
              alt="linkMaps"
              target="_blank"
              rel="noopener noreferrer"
            >
              {venue.location.address}
            </a>
          ) : (
            <p>No address</p>
          )}
        </div>
        <div className="venueDistance">
          <p>{venue.location.distance}m</p>
        </div>
      </div>
    </div>
  );
};

export default Venue;
