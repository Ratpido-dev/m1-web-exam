import axios from "axios";
import { useState } from "react";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
} from "../models/BikeModel";

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (page: number, limit: number) => {
    setIsLoading(true);
    axios
      .get<BikesPageModel>("http://localhost:3000/bikes", {
        params: { page, limit },
      })
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Returns the request so the caller can react to errors (e.g. bike already sold)
  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {});

  const createBike = (input: CreateBikeModel) =>
    axios.post<BikeModel>("http://localhost:3000/bikes", input).then(() => {});

  return { bikes, totalCount, load, isLoading, deleteBike, createBike };
};
