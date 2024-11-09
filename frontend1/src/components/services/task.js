import { deleteDataApi, getDataApi, addDataApi, getDataByIdApi } from "../constant/api";
import * as opsService from "./Ops";

export const addData = async (data) => {
  let result = await opsService.postdata(addDataApi, data);
  return result;
};
export const getData = async () => {
  let result = await opsService.getData(getDataApi);
  return result;
};

export const getDataById = async (id) => {
  let result = await opsService.getData(getDataByIdApi+"/"+id);
  return result;
};

export const deleteData = async (data) => {
  let result = await opsService.postdata(deleteDataApi,data);
  return result;
};
