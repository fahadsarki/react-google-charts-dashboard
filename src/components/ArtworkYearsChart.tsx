import React, { useMemo } from "react";
import { Query } from "@cubejs-client/core";
import { useCubeQuery } from "@cubejs-client/react";
import { Chart } from "react-google-charts";
import { Loader } from "./Loader";
import {
  addArtistsFilter,
  getMaxCount,
  buildDataTable,
  getPointStyles
} from "./common";

export interface ArtworkYearsChartProps {
  artistsFilter?: string[];
}

const query: Query = {
  dimensions: ["Artworks.year", "Artworks.yearAcquired"],
  measures: ["Artworks.count"],
  filters: [
    {
      member: "Artworks.classification",
      operator: "equals",
      values: ["Painting"]
    },
    {
      member: "Artworks.yearAcquired",
      operator: "set"
    },
    {
      member: "Artworks.year",
      operator: "set"
    }
  ]
};

const options = {
  title: "Year created vs. Year acquired",
  hAxis: { viewWindowMode: "maximized", title: "Year created" },
  vAxis: { viewWindowMode: "maximized", title: "Year acquired" },
  pointSize: 3,
  legend: "none"
};

const labels = [
  "Year created",
  "Year acquired",
  { type: "string", role: "style" }
];

export function ArtworkYearsChart({ artistsFilter }: ArtworkYearsChartProps) {
  const finalQuery = useMemo(() => addArtistsFilter(query, artistsFilter), [
    artistsFilter
  ]);
  const { resultSet, isLoading, error, progress } = useCubeQuery(finalQuery);
  const maxCount = useMemo(() => getMaxCount(resultSet), [resultSet]);
  const data = useMemo(
    () =>
      buildDataTable(resultSet, labels, (row) => [
        Number(row["Artworks.year"]),
        Number(row["Artworks.yearAcquired"]),
        getPointStyles(Number(row["Artworks.count"]), maxCount)
      ]),
    [resultSet, maxCount]
  );

  if (isLoading || !resultSet) {
    return <Loader progress={progress} />;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <Chart
      chartType="ScatterChart"
      width="100%"
      height={500}
      data={data}
      options={options}
    />
  );
}
