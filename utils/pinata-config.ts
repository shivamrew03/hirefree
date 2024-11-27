export const PINATA_CONFIG = {
    apiKey: "2733759213a83f46eb27",
    apiSecret: "0b0eb54d0597b76cdbf0bc4ec36e403f16c7ace1c2cbfd8b650ef4f3583cdc00",
    JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NDdmNDc5YS1jNzkzLTRkMWMtYjQ1Yy1jN2NkNmIxMzA0YjEiLCJlbWFpbCI6InNoaXZhbXJld2F0a2FyMDNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjI3MzM3NTkyMTNhODNmNDZlYjI3Iiwic2NvcGVkS2V5U2VjcmV0IjoiMGIwZWI1NGQwNTk3Yjc2Y2RiZjBiYzRlYzM2ZTQwM2YxNmM3YWNlMWMyY2JmZDhiNjUwZWY0ZjM1ODNjZGMwMCIsImV4cCI6MTc2MzcwOTM2NH0.j4mYXrmxu0RYoLZjhUPX-uF1lsjiuL_l3JpWQIqbKbY",
    baseURL: "https://api.pinata.cloud",
    gateway: "https://gateway.pinata.cloud/ipfs"
  };
  
  export const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${PINATA_CONFIG.JWT}`
    }
  });
  