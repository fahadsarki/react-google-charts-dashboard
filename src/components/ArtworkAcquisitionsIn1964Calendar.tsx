import React, { useMemo } from "react";
import { Query } from "@cubejs-client/core";
import { useCubeQuery } from "@cubejs-client/react";
import { Chart } from "react-google-charts";
import { Loader } from "./Loader";
import { addArtistsFilter, buildDataTable } from "./common";

export interface ArtworkAcquisitionsIn1964CalendarProps {
  artistsFilter?: string[];
}

const query: Query = {
  dimensions: ["Artworks.dateAcquired"],
  measures: ["Artworks.count"],
  filters: [
    {
      member: "Artworks.yearAcquired",
      operator: "equals",
      values: ["1964"]
    }
  ]
};

const options = {
  title: "Acquisitions",
  colorAxis: {
    maxValue: 500
  },
  legend: "none"
};

const labels = ["Date acquired", "Count"];

export function ArtworkAcquisitionsIn1964Calendar({
  artistsFilter
}: ArtworkAcquisitionsIn1964CalendarProps) {
  const finalQuery = useMemo(() => addArtistsFilter(query, artistsFilter), [
    artistsFilter
  ]);
  const { resultSet, isLoading, error, progress } = useCubeQuery(finalQuery);
  const data = useMemo(
    () =>
      buildDataTable(resultSet, labels, (row) => [
        new Date(row["Artworks.dateAcquired"] as string),
        Number(row["Artworks.count"])
      ]),
    [resultSet]
  );

  if (isLoading || !resultSet) {
    return <Loader progress={progress} />;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (data.length < 2) {
    return null;
  }

  return <Chart chartType="Calendar" data={data} options={options} />;
}
