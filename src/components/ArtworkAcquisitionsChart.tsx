import React, { useMemo } from "react";
import { Query } from "@cubejs-client/core";
import { useCubeQuery } from "@cubejs-client/react";
import { Chart } from "react-google-charts";
import { Loader } from "./Loader";
import { addArtistsFilter, buildDataTable } from "./common";

export interface ArtworkAcquisitionsChartProps {
  artistsFilter?: string[];
}

const query: Query = {
  dimensions: ["Artworks.yearAcquired"],
  measures: ["Artworks.count"],
  filters: [
    {
      member: "Artworks.yearAcquired",
      operator: "set"
    }
  ]
};

const options = {
  title: "Acquisitions by year",
  legend: "none",
  trendlines: {
    0: {
      lineWidth: 1,
      color: "green"
    }
  }
};

const labels = ["Year", "Paintings"];

export function ArtworkAcquisitionsChart({
  artistsFilter
}: ArtworkAcquisitionsChartProps) {
  const finalQuery = useMemo(() => addArtistsFilter(query, artistsFilter), [
    artistsFilter
  ]);
  const { resultSet, isLoading, error, progress } = useCubeQuery(finalQuery);
  const data = useMemo(
    () =>
      buildDataTable(resultSet, labels, (row) => [
        Number(row["Artworks.yearAcquired"]),
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

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height={500}
      data={data}
      options={options}
    />
  );
}
