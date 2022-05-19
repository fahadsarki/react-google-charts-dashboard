import React from "react";
import { ProgressResponse } from "@cubejs-client/core";

export interface LoaderProps {
  progress?: ProgressResponse;
}

export function Loader({ progress }: LoaderProps) {
  return <div>{progress?.stage || "Loading..."}</div>;
}
