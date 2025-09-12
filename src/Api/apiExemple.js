import api from "./api.js";

/* ---------- IMAGES ---------- */

export async function apiGetImages(id = null) {
  const url = id ? `/image.php?id=${id}` : `/image.php`;
  const response = await api.axiosInstanceNathan.get(url);
  return response.data;
}

export async function apiCreateImage(alt, difficulty, link) {
  const response = await api.axiosInstanceNathan.post(`/image.php`, {
    alt,
    difficulty,
    link,
  });
  return response.data;
}

export async function apiUpdateImage(id, alt, difficulty, link) {
  const response = await api.axiosInstanceNathan.put(`/image.php`, {
    id,
    alt,
    difficulty,
    link,
  });
  return response.data;
}

export async function apiDeleteImage(id) {
  const response = await api.axiosInstanceNathan.delete(`/image.php?id=${id}`);
  return response.data;
}

/* ---------- SCOREBOARD ---------- */

export async function apiGetScores(id = null) {
  const url = id ? `/scoreboard.php?id=${id}` : `/scoreboard.php`;
  const response = await api.axiosInstanceNathan.get(url);
  return response.data;
}

export async function apiCreateScore(nickname, difficulty, score) {
  const response = await api.axiosInstanceNathan.post(`/scoreboard.php`, {
    nickname,
    difficulty,
    score,
  });
  return response.data;
}

export async function apiUpdateScore(id, nickname, difficulty, score) {
  const response = await api.axiosInstanceNathan.put(`/scoreboard.php`, {
    id,
    nickname,
    difficulty,
    score,
  });
  return response.data;
}

export async function apiDeleteScore(id) {
  const response = await api.axiosInstanceNathan.delete(`/scoreboard.php?id=${id}`);
  return response.data;
}

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
