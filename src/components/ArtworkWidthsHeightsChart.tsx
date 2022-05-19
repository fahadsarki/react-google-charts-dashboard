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

export interface ArtworkWidthsHeightsChartProps {
  artistsFilter?: string[];
}

const query: Query = {
  dimensions: ["Artworks.widthCm", "Artworks.heightCm"],
  measures: ["Artworks.count"],
  filters: [
    {
      member: "Artworks.classification",
      operator: "equals",
      values: ["Painting"]
    },
    {
      member: "Artworks.widthCm",
      operator: "set"
    },
    {
      member: "Artworks.widthCm",
      operator: "lt",
      values: ["1000"]
    },
    {
      member: "Artworks.heightCm",
      operator: "set"
    },
    {
      member: "Artworks.heightCm",
      operator: "lt",
      values: ["1000"]
    }
  ]
};

const options = {
  title: "Paintings, tall and wide",
  hAxis: { viewWindowMode: "maximized", title: "Width, cm" },
  vAxis: { viewWindowMode: "maximized", title: "Height, cm" },
  pointSize: 3,
  legend: "none"
};

const labels = ["Width", "Height", { type: "string", role: "style" }];

export function ArtworkWidthsHeightsChart({
  artistsFilter
}: ArtworkWidthsHeightsChartProps) {
  const finalQuery = useMemo(() => addArtistsFilter(query, artistsFilter), [
    artistsFilter
  ]);
  const { resultSet, isLoading, error, progress } = useCubeQuery(finalQuery);
  const maxCount = useMemo(() => getMaxCount(resultSet), [resultSet]);
  const data = useMemo(
    () =>
      buildDataTable(resultSet, labels, (row) => {
        const width = Number(row["Artworks.widthCm"]);
        const height = Number(row["Artworks.heightCm"]);
        const ratio = width / height;

        return [
          width,
          height,
          getPointStyles(Number(row["Artworks.count"]), maxCount, ratio)
        ];
      }),
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
