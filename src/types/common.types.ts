export interface Entity{
  id:string
};
export interface IdParams extends Entity{};
export interface ListResponse<T>{
  items:T[]
}
