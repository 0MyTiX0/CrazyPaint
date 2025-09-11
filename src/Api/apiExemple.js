import api from "/api.js";

export async function apiGetBenefits(space_id) {
  const response = await api.axiosInstance.get(`/spaces/${space_id}/benefits/`);
  return response.data.benefits;
}

export async function apiCreateBenefit(space_id, name) {
  const response = await api.axiosInstance.post(
    `/spaces/${space_id}/benefits`,
    { name }
  );
  return response.data;
}

export async function apiUpdateBenefit(benefit_id, name) {
  const response = await api.axiosInstance.put(`/benefits/${benefit_id}`, {
    name,
  });
  return response.data;
}

export async function apiDeleteBenefit(benefit_id) {
  const response = await api.axiosInstance.delete(`/benefits/${benefit_id}`);
  return response.data;
}
