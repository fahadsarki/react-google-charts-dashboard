import React, { useMemo } from "react";
import { Query } from "@cubejs-client/core";
import { useCubeQuery } from "@cubejs-client/react";
import { Chart } from "react-google-charts";
import { Loader } from "./Loader";
import { addArtistsFilter, buildDataTable } from "./common";

export interface ArtworkAcquisitionsAgeChartProps {
  artistsFilter?: string[];
}

const query: Query = {
  dimensions: ["Artworks.yearAcquired"],
  measures: [
    "Artworks.minAgeAtAcquisition",
    "Artworks.avgAgeAtAcquisition",
    "Artworks.maxAgeAtAcquisition"
  ],
  filters: [
    {
      member: "Artworks.yearAcquired",
      operator: "set"
    }
  ]
};

const options = {
  title: "Acquisitions by age",
  colorAxis: {
    maxValue: 500
  },
  legend: "none"
};

const labels = ["Year acquired", "Low", "Open", "Close", "High"];

export function ArtworkAcquisitionsAgeChart({
  artistsFilter
}: ArtworkAcquisitionsAgeChartProps) {
  const finalQuery = useMemo(() => addArtistsFilter(query, artistsFilter), [
    artistsFilter
  ]);
  const { resultSet, isLoading, error, progress } = useCubeQuery(finalQuery);
  const data = useMemo(
    () =>
      buildDataTable(resultSet, labels, (row) => [
        row["Artworks.yearAcquired"] as string,
        Number(row["Artworks.minAgeAtAcquisition"]),
        Number(row["Artworks.avgAgeAtAcquisition"]),
        Number(row["Artworks.avgAgeAtAcquisition"]),
        Number(row["Artworks.maxAgeAtAcquisition"])
      ]),
    [resultSet]
  );

  if (isLoading || !resultSet) {
    return <Loader progress={progress} />;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  return <Chart chartType="CandlestickChart" data={data} options={options} />;
}
