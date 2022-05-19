import React, { useMemo } from "react";
import { Query } from "@cubejs-client/core";
import { useCubeQuery } from "@cubejs-client/react";
import { Chart } from "react-google-charts";
import { Loader } from "./Loader";
import { addArtistsFilter, buildDataTable } from "./common";

export interface ArtworkMediumsTableProps {
  artistsFilter?: string[];
}

const query: Query = {
  dimensions: ["Artworks.medium"],
  measures: ["Artworks.count"],
  filters: [
    {
      member: "Artworks.classification",
      operator: "equals",
      values: ["Painting"]
    }
  ]
};

const options = {
  showRowNumber: true,
  page: "enable",
  pageSize: 20
};

const labels = ["Medium", "Paintings"];

export function ArtworkMediumsTable({
  artistsFilter
}: ArtworkMediumsTableProps) {
  const finalQuery = useMemo(() => addArtistsFilter(query, artistsFilter), [
    artistsFilter
  ]);
  const { resultSet, isLoading, error, progress } = useCubeQuery(finalQuery);
  const data = useMemo(
    () =>
      buildDataTable(resultSet, labels, (row) => [
        row["Artworks.medium"] as string,
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
      chartType="Table"
      width="100%"
      height={500}
      data={data}
      options={options}
    />
  );
}
