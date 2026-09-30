"use client";

import { GenericFetchWithQueries } from "@generic/classes/response";
import { useLoading } from "@generic/customHooks";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const UploadContext = createContext();

// TODO: convert to TSX
export function useUploads() {
  return useContext(UploadContext);
}

// TODO: filter options should probably go here
// can re-order uploads here
export function UploadProvider({ ...props }) {
  const [uploads, setUploads] = useState([]);
  // const [c, setCount] = useState(20);
  // const [p, setPage] = useState(0);
  const { loading, startLoading, stopLoading } = useLoading();
  const params = useSearchParams();

  const getUploads = useCallback(async (lewds) => {
    var count = parseInt(params.get("count")) || 20, page = parseInt(params.get("page")) || 0;
    while (true) {
      const resp = await GenericFetchWithQueries("getUploads", {
        lewds: lewds,
        count: count,
        page: page,
      })
        .then((resp) => resp.json())
        .catch(() => { });

      setUploads(uploads ? [...uploads, ...resp.rows] : resp.rows);
      if (resp.rows?.length || 0 < count) break;
      page += count;
    }

    stopLoading();
  }, [params])


  const ctx = useMemo(() => ({ uploads, getUploads, imageUrl, coverUrl, loading, startLoading }), 
  [uploads, getUploads, imageUrl, coverUrl, loading, startLoading])

  return <UploadContext.Provider value={ctx} {...props} />
}