import React, { useMemo, memo } from "react";
import { Query } from "@cubejs-client/core";
import { useCubeQuery } from "@cubejs-client/react";
import { ReactGoogleChartEvent, Chart } from "react-google-charts";
import { Loader } from "./Loader";
import { buildDataTable } from "./common";

export interface ArtworkArtistsTableProps {
  onSelect?(selectedArtists: string[]): void;
}

const MemoChart = memo(Chart);

const query: Query = {
  dimensions: ["Artworks.artist"],
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

const labels = ["Artist", "Paintings"];

export function ArtworkArtistsTable({ onSelect }: ArtworkArtistsTableProps) {
  const { resultSet, isLoading, error, progress } = useCubeQuery(query);
  const data = useMemo(
    () =>
      buildDataTable(resultSet, labels, (row) => [
        row["Artworks.artist"] as string,
        Number(row["Artworks.count"])
      ]),
    [resultSet]
  );
  const events = useMemo<ReactGoogleChartEvent[]>(
    () => [
      {
        eventName: "select",
        callback({ chartWrapper }) {
          const chart = chartWrapper.getChart();
          const selection = chart
            .getSelection()
            .map((_) => data[_.row + 1][0] as string);

          onSelect?.(selection);
        }
      }
    ],
    [onSelect, data]
  );

  if (isLoading || !resultSet) {
    return <Loader progress={progress} />;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <MemoChart
      chartType="Table"
      width="100%"
      height={500}
      data={data}
      options={options}
      chartEvents={events}
    />
  );
}
