import { ec } from "elliptic";
import config from "config";

const CURVE = config.get<string>("elliptic.curve");

export const elliptic = new ec(CURVE);

export const getElliptic = () => {
  return elliptic;
};
