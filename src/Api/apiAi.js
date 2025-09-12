import api from "./api.js";

export async function apiSubmitDrawing(imageBase64, description) {
  const response = await api.axiosInstance.post(
    "/chat",
    {
      model: "notation-7", // ton Modelfile wrap de qwen2.5vl:3b
      messages: [
        {
          role: "user",
          content: `Décris ce dessin et compare-le à la description : ${description}`,
          images: [imageBase64],
        },
      ],
      format: "json",
      options: { num_predict: 220 },
      stream: false,
    },
    { timeout: 30000 }
  );

  return response.data;
}
