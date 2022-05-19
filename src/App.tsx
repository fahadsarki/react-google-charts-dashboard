import React, { useState } from "react";
import cubejs from "@cubejs-client/core";
import { CubeProvider } from "@cubejs-client/react";
import { CUBEJS_TOKEN, CUBEJS_HOST } from "./constants";
import { ArtworkArtistsTable } from "./components/ArtworkArtistsTable";
import { ArtworkMediumsTable } from "./components/ArtworkMediumsTable";
import { ArtworkYearsChart } from "./components/ArtworkYearsChart";
import { ArtworkWidthsHeightsChart } from "./components/ArtworkWidthsHeightsChart";
import { ArtworkAcquisitionsChart } from "./components/ArtworkAcquisitionsChart";
import { ArtworkAcquisitionsIn1964Calendar } from "./components/ArtworkAcquisitionsIn1964Calendar";
import { ArtworkAcquisitionsAgeChart } from "./components/ArtworkAcquisitionsAgeChart";

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${CUBEJS_HOST}/cubejs-api/v1`
});

export function App() {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  return (
    <CubeProvider cubejsApi={cubejsApi}>
      <div className="dashboard">
        <div className="group">
          <ArtworkArtistsTable onSelect={setSelectedArtists} />
          <ArtworkMediumsTable artistsFilter={selectedArtists} />
        </div>
        <div className="group">
          <ArtworkYearsChart artistsFilter={selectedArtists} />
          <ArtworkWidthsHeightsChart artistsFilter={selectedArtists} />
        </div>
        <ArtworkAcquisitionsChart artistsFilter={selectedArtists} />
        <ArtworkAcquisitionsIn1964Calendar artistsFilter={selectedArtists} />
        <ArtworkAcquisitionsAgeChart artistsFilter={selectedArtists} />
      </div>
    </CubeProvider>
  );
}
