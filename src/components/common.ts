import { Query, ResultSet } from "@cubejs-client/core";

export function addArtistsFilter(query: Query, artists: string[]): Query {
  return !artists?.length
    ? query
    : {
        ...query,
        filters: [
          ...query.filters,
          {
            member: "Artworks.artist",
            operator: "equals",
            values: artists
          }
        ]
      };
}

type Mapper = (row: {
  [key: string]: string | number | boolean;
}) => (string | number | Record<string, string> | Date)[];

export function buildDataTable(
  resultSet: ResultSet,
  labels: (string | Record<string, string>)[],
  mapper: Mapper
) {
  const rows = resultSet?.tablePivot().map(mapper);

  rows?.unshift(labels);

  return rows;
}

export function getMaxCount(resultSet: ResultSet) {
  return resultSet
    ?.tablePivot()
    .reduce((max, row) => Math.max(max, Number(row["Artworks.count"])), 0);
}

export function getPointStyles(
  count: number,
  maxCount: number,
  ratio?: number
) {
  let styles = `opacity: ${(count / maxCount).toFixed(1)};`;

  if (typeof ratio === "number") {
    styles += `color: ${
      ratio === 1 ? "black" : ratio < 1 ? "orange" : "purple"
    };`;
  }

  return `point { ${styles} }`;
}
